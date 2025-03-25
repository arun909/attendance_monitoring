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

  // Webcam and directory states
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [customDirectoryPath, setCustomDirectoryPath] = useState('');
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const handleDirectorySelection = async () => {
    try {
      // For Chrome/Edge - using File System Access API
      if ('showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        if (await handle.queryPermission({ mode: 'readwrite' }) !== 'granted') {
          const permission = await handle.requestPermission({ mode: 'readwrite' });
          if (permission !== 'granted') throw new Error('Permission denied');
        }
        setDirectoryHandle(handle);
        setCustomDirectoryPath(handle.name);
        setMessage({ text: "Directory access granted", type: 'success' });
      } 
      // For other browsers - fallback to download with custom path
      else {
        setMessage({ 
          text: "Browser doesn't support direct folder access. Images will download to default location with custom path structure.", 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error("Directory selection error:", error);
      setMessage({ text: "Could not access directory", type: 'error' });
    }
  };

  const saveImagesWithCustomPath = async () => {
    if (!name.trim()) {
      setMessage({ text: "Please enter student name first", type: 'error' });
      return false;
    }

    try {
      // For browsers supporting File System Access API
      if (directoryHandle) {
        // Create the full custom path structure
        const pathParts = customDirectoryPath.split('/').filter(Boolean);
        let currentHandle = directoryHandle;
        
        // Navigate through the custom path structure
        for (const folderName of pathParts) {
          currentHandle = await currentHandle.getDirectoryHandle(folderName, { create: true });
        }
        
        // Create student folder
        const studentFolderName = `${name}_${customId}`.replace(/[^a-z0-9]/gi, '_');
        const studentFolderHandle = await currentHandle.getDirectoryHandle(studentFolderName, { create: true });

        // Save images
        for (let i = 0; i < capturedImages.length; i++) {
          const imageDataUrl = capturedImages[i];
          const blob = await (await fetch(imageDataUrl)).blob();
          const fileName = `student_${i + 1}.jpg`;
          const fileHandle = await studentFolderHandle.getFileHandle(fileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        }

        setMessage({ 
          text: `Saved ${capturedImages.length} images to: ${customDirectoryPath}/${studentFolderName}`,
          type: 'success'
        });
        return true;
      }
      // Fallback for other browsers
      else {
        capturedImages.forEach((imgData, index) => {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `${customDirectoryPath}/${name}_${customId}/student_${index + 1}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

        setMessage({ 
          text: `${capturedImages.length} images queued for download with path: ${customDirectoryPath}/${name}_${customId}`,
          type: 'success'
        });
        return true;
      }
    } catch (error) {
      console.error("Error saving images:", error);
      setMessage({ 
        text: "Failed to save images to specified path", 
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

      // Save images with custom path if any were captured
      if (capturedImages.length > 0) {
        await saveImagesWithCustomPath();
      }

      setMessage({ 
        text: "Student added successfully! Images saved with specified path.", 
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

        {/* Custom Directory Path */}
        <div>
          <label htmlFor="directoryPath" className="block text-sm font-medium text-gray-700">
            Save Images To Path (e.g., "School/Student_Photos")
          </label>
          <div className="flex mt-1">
            <input
              id="directoryPath"
              type="text"
              value={customDirectoryPath}
              onChange={(e) => setCustomDirectoryPath(e.target.value)}
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              placeholder="Enter folder path"
            />
            <button
              type="button"
              onClick={handleDirectorySelection}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border border-blue-600"
            >
              Select
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {directoryHandle ? 
              "Directory access granted" : 
              "Path will be used for downloaded files if browser doesn't support direct folder access"}
          </p>
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