import { useState, useRef, useEffect } from 'react';
import { supabase } from '../Auth/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  // Form states
  const [customId, setCustomId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Webcam states
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Hardcoded directory path
  const customDirectoryPath = "C:\\Users\\basil\\OneDrive\\Desktop\\basil\\deepface\\database";

  // Initialize webcam
  useEffect(() => {
    if (showWebcam) {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
          setMessage({ text: "Could not access webcam", type: 'error' });
        }
      };
      startWebcam();
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }, [showWebcam]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImages(prev => [...prev, imageDataUrl]);
    setCaptureCount(prev => prev + 1);
  };

  const saveImagesToDirectory = async () => {
    if (!name.trim() || !customId.trim()) {
      setMessage({ text: "Student name and ID are required to save images", type: 'error' });
      return false;
    }
  
    const studentFolderName = `${name}_${customId}`.replace(/[^a-z0-9]/gi, '_');
    const fullPath = `C:\\Users\\basil\\OneDrive\\Desktop\\basil\\deepface\\database\\${studentFolderName}`;
  
    try {
      // Try to get permission silently (won't work in most browsers)
      let granted = false;
      if ('showDirectoryPicker' in window) {
        try {
          // This will still prompt, but we minimize interaction
          const dirHandle = await window.showDirectoryPicker({
            mode: 'readwrite',
            id: 'myAppImagesFolder', // Browser may remember this
            startIn: 'desktop' // Start near target directory
          });
          
          granted = true;
          // Create student folder
          const studentFolder = await dirHandle.getDirectoryHandle(studentFolderName, { create: true });
          
          // Save images
          for (let i = 0; i < capturedImages.length; i++) {
            const blob = await fetch(capturedImages[i]).then(r => r.blob());
            const fileHandle = await studentFolder.getFileHandle(`student_${i}.jpg`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          }
          
          return true;
        } catch (error) {
          console.log("Filesystem access failed, falling back to download");
        }
      }
  
      // Fallback: Zip and download all images with proper path structure
      if (!granted) {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const folder = zip.folder(studentFolderName);
        
        await Promise.all(capturedImages.map(async (img, i) => {
          const blob = await fetch(img).then(r => r.blob());
          folder.file(`student_${i}.jpg`, blob);
        }));
        
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${studentFolderName}.zip`;
        a.click();
        
        setMessage({
          text: `Downloaded ZIP with images for ${studentFolderName}. Unzip to: ${fullPath}`,
          type: 'success'
        });
        return true;
      }
    } catch (error) {
      console.error("Error saving images:", error);
      setMessage({
        text: "Couldn't save images automatically. Please save them manually.",
        type: 'error'
      });
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!customId.trim()) errors.customId = 'Student ID is required';
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.includes('@') || !email.includes('.')) errors.email = 'Invalid email address';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      // Check for existing user
      const { data: existingUsers, error: lookupError } = await supabase
        .from('users')
        .select('email, id')
        .or(`email.eq.${email},id.eq.${customId}`);
        
      if (lookupError) throw lookupError;
      if (existingUsers?.some(user => user.email === email)) {
        throw new Error('Email already registered');
      }
      if (existingUsers?.some(user => user.id === customId)) {
        throw new Error('Student ID already exists');
      }

      // Insert student data
      const { error } = await supabase
        .from('users')
        .insert([{
          id: customId,
          name,
          email,
          password,
          role: 'student'
        }]);

      if (error) throw error;

      // Save images to the hardcoded directory if any were captured
      if (capturedImages.length > 0) {
        await saveImagesToDirectory();
      }

      setMessage({ 
        text: "Student added successfully! Images saved to specified directory.", 
        type: 'success' 
      });
      
      // Reset form
      setCustomId('');
      setName('');
      setEmail('');
      setPassword('');
      setCapturedImages([]);
      setCaptureCount(0);
      
      setTimeout(() => navigate('/teacher-dashboard'), 2000);
      
    } catch (error) {
      setMessage({
        text: `Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Student</h2>
      
      <form onSubmit={handleAddStudent} className="space-y-4">
        {/* Student ID Field */}
        <div>
          <label htmlFor="customId" className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            id="customId"
            type="text"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
              formErrors.customId ? 'border-red-500' : ''
            }`}
            placeholder="Enter student ID"
          />
          {formErrors.customId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.customId}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
              formErrors.name ? 'border-red-500' : ''
            }`}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
              formErrors.email ? 'border-red-500' : ''
            }`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
              formErrors.password ? 'border-red-500' : ''
            }`}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        {/* Webcam Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Capture Student Images (Optional)</h3>
          
          {!showWebcam ? (
            <button
              type="button"
              onClick={() => setShowWebcam(true)}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 mb-2"
            >
              Open Webcam
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-md overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-64 object-cover"
                />
                <canvas 
                  ref={canvasRef} 
                  className="hidden" 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Captured: {captureCount} images
                </span>
                <button
                  type="button"
                  onClick={captureImage}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Capture
                </button>
              </div>

              {capturedImages.length > 0 && (
                <div className="mt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {capturedImages.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`Capture ${index + 1}`} 
                        className="h-16 w-16 object-cover rounded border border-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowWebcam(false)}
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close Webcam
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Add Student'
            )}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`rounded-md p-4 ${
            message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'error' ? (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <p className="ml-3 text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddStudent;