// src/components/StoryGenerator.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, rtdb } from '../Firebase'; // Corrected import path
import { ref, push, onValue } from 'firebase/database';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D } from '@react-three/drei';
import { useForm } from 'react-hook-form';
import * as THREE from 'three';

function StoryGenerator() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyData, setStoryData] = useState([]);
  const canvasRef = useRef();

  useEffect(() => {
    if (auth.currentUser) {
      const userStoryRef = ref(rtdb, `users/${auth.currentUser.uid}/stories`);
      onValue(userStoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const storyList = Object.values(data);
          setStoryData(storyList);
        } else {
          setStoryData([]);
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const generateStory = (inputText) => {
    // **Crucially, this is where your story generation logic will go.**
    // For now, let's just echo the input text.
    const story = `Generated story based on: "${inputText}"\n\n... (The actual story would be much longer and more creative here) ...`;
    setGeneratedStory(story);

    // Save the generated story to Firebase
    if (auth.currentUser) {
      const userStoryRef = ref(rtdb, `users/${auth.currentUser.uid}/stories`);
      push(userStoryRef, { textInput: inputText, generatedText: story, timestamp: new Date().toISOString() });
    }
  };

  const onSubmit = (data) => {
    generateStory(data.prompt);
  };

  const handleDownload = () => {
    if (generatedStory) {
      const element = document.createElement('a');
      const file = new Blob([generatedStory], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'generated_story.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div>
      <h2>Text to 3D Story Generator</h2>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Enter your story prompt:</label>
          <textarea {...register('prompt', { required: 'Please enter a prompt' })} rows="4" cols="50" />
        </div>
        <button type="submit">Generate Story</button>
      </form>

      {generatedStory && (
        <div>
          <h3>Generated Story:</h3>
          <pre>{generatedStory}</pre>
          <button onClick={handleDownload}>Download Story</button>
        </div>
      )}

      <h3>Your Previous Stories:</h3>
      <ul>
        {storyData.map((story, index) => (
          <li key={index}>
            <p>Prompt: {story.textInput}</p>
            <pre>Story: {story.generatedText.substring(0, 100)}...</pre> {/* Display a snippet */}
          </li>
        ))}
      </ul>

      {generatedStory && (
        <div style={{ width: '500px', height: '300px' }}>
          <Canvas ref={canvasRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <Text3D font="/fonts/helvetiker_regular.typeface.json" size={3} height={0.5} curveSegments={12} bevelEnabled bevelThickness={0.2} bevelSize={0.1} bevelOffset={0} bevelSegments={5}>
              {generatedStory.substring(0, 50)} {/* Display a portion of the story in 3D */}
              <meshStandardMaterial color="lightblue" />
            </Text3D>
            <OrbitControls />
          </Canvas>
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;