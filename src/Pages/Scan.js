// Scan.js

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { db, collection, getDocs, where, query, addDoc } from '../config';
import { v4 as uuidv4 } from 'uuid';

const Scan = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('New Person');
  const [playerNotes, setPlayerNotes] = useState('No Notes added');

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    loadModel();
    
    // Check if playerId is already stored locally
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      // Generate a new playerId if not found locally
      const newPlayerId = uuidv4();
      setPlayerId(newPlayerId);
      localStorage.setItem('playerId', newPlayerId);
    }
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Captured image:', imageSrc);

    const blob = await (await fetch(imageSrc)).blob();
    const imageElement = new Image();
    
    imageElement.src = URL.createObjectURL(blob);

    imageElement.onload = async () => {
      const predictions = await model.detect(imageElement);
      console.log('TensorFlow.js predictions:', predictions);

      if (predictions.length > 0) {
        const detectedObject = predictions[0]; 

        const profilePicUrl = playerId;

        const querySnapshot = await getDocs(
          query(collection(db, 'Players'), where('ProfilePicUrl', '==', profilePicUrl))
        );

        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const { name, notes } = doc.data();
            console.log('Player found:', doc.data());
            setPlayerName(name);
            setPlayerNotes(notes);
          });
        } else {
          console.log('No player found.');

          // Display a message when a new player is found
          setPlayerName('New Person');
          setPlayerNotes('No Notes added');

          // Add the new player to the Players collection
          await addDoc(collection(db, 'Players'), {
            playerId,
            ProfilePicUrl: profilePicUrl,
            name: 'New Person',
            notes: 'No Notes added',
          });

          console.log('New player added to the database.');
        }
      } else {
        console.log('No object detected.');
      }
    };
  };

  return (
    <div>
      <h1>Scan Page</h1>
      <Webcam ref={webcamRef} />
      <button onClick={capture}>Capture and Identify</button>
      <div>
        <h3>{playerName}</h3>
        <h3>{playerNotes}</h3>
      </div>
    </div>
  );
};

export default Scan;
