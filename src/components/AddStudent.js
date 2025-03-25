const handleAddStudent = async (e) => {
  e.preventDefault();
  
  // Add client-side validation
  if (!email.includes('@') || !email.includes('.')) {
      setMessage("❌ Please enter a valid email address");
      return;
  }
  
  if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
  }

  setLoading(true);
  setMessage(null);

  try {
      // First check if user exists
      const { data: existingUsers } = await supabase
          .from('users')
          .select('email')
          .eq('email', email);
          
      if (existingUsers && existingUsers.length > 0) {
          throw new Error('This email is already registered');
      }

      // Register student
      const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
              data: {
                  name,
                  role: 'student'
              }
          }
      });

      if (error) throw error;

      setMessage("✅ Student added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      
  } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      
      // Specific rate limit handling
      if (error.message.includes('rate limit')) {
          setMessage("❌ Too many requests. Please wait before trying again.");
      }
  } finally {
      setLoading(false);
  }
};