import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import firebase from 'firebase/compat/app';
import { auth } from '../configurations';

const LoginSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        // Login successful
        // Navigate to First Screen
        console.log(user);
      })
      .catch(error => {
        // Login failed
        setError(error.message);
      });
  };

  handleSignup = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        // Signup successful
        console.log(user);
      })
      .catch(error => {
        // Signup failed
        setError(error.message);
      });
  };

  return (
    <SafeAreaView>
      {error && <Text>{error}</Text>}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin} title="Login" />
      <Button onPress={handleSignup} title="Sign up" />
    </SafeAreaView>
  );
};

export default LoginSignupPage;