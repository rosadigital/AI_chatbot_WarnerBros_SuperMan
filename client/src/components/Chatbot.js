import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import BackgroundImage from '../assets/image/WB_superman2025.jpg'; // Importing the background image

function cleanText(text) {
  const matches = text.match(/【\d+:\d+†source】/g) || [];
  return text.replace(/【\d+:\d+†source】/g, '').trim();
}

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [input, setInput] = useState(''); // Manage user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const messagesEndRef = useRef(null); // Scroll to the end of messages

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const getMessages = async () => {
    if (input.trim() === '') return;

    // Add user's message to the state
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Get last bot message
    const lastBotMessage = messages.slice().reverse().find((msg) => msg.sender === 'bot');
    const userInput = `resposta anterior: ${lastBotMessage ? lastBotMessage.text : ''} pergunta atual: ${input}`;

    setInput('');
    setIsLoading(true);

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ messages: userInput }),
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/threads`, options);

      if (!response.ok) {
        const errorMessage = { sender: 'bot', text: 'Error processing your message. Please try again.' };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const data = await response.json();
      const rawBotResponse = data.messages[0].content[0].text.value;
      const botResponse = cleanText(rawBotResponse);

      const botMessage = { sender: 'bot', text: botResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Connection error. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${BackgroundImage})`, // Set the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: '83.33%', // 10/12 of the screen
          // maxWidth: '960px',
          height: '80vh',
          backgroundColor: 'rgba(11, 30, 55, 0.8)', // Deep Blue with transparency
          color: '#f4f4f4', // Soft white for text
          borderRadius: 4,
          boxShadow: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            backgroundColor: '#0b1e37', // Solid Deep Blue
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h6" sx={{ color: '#f4f4f4' }}>WB - Superman Chat</Typography>
          <IconButton onClick={() => window.close()} sx={{ color: '#f4f4f4' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
          <List>
            {/* Welcome Message */}
            <ListItem
              sx={{
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: '#f7b731', // Golden Yellow for the welcome message
                  color: '#000', // Black text for contrast
                  maxWidth: '70%',
                }}
              >
                Welcome to the Warner Bros Superman 2025 chatbot! I am Superman, also known as Kal-El. Ask me anything about my life, powers, or adventures!
              </Paper>
            </ListItem>

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? '#42a5f5' : '#0b1e37', // Light Blue for user, Deep Blue for bot
                    color: '#f4f4f4',
                    maxWidth: '70%',
                  }}
                >
                  {message.text}
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f4f4f4', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <Typography variant="body2">Fetching response...</Typography>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Input Field */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            backgroundColor: '#0b1e37', // Solid Deep Blue for input background
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getMessages()}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                color: '#000',
                '& fieldset': { borderColor: '#d82c2e' },
                '&:hover fieldset': { borderColor: '#ff7043' },
                '&.Mui-focused fieldset': { borderColor: '#ffccbc' },
              },
            }}
          />
          <IconButton onClick={getMessages} sx={{ color: '#d82c2e', ml: 1 }}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
