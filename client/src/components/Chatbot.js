// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Fab,
//   Typography,
//   TextField,
//   IconButton,
//   List,
//   ListItem,
//   Paper,
//   CircularProgress,
// } from '@mui/material';
// import { Chat, Close, Send } from '@mui/icons-material';


// function cleanText(text) {
//   const matches = text.match(/【\d+:\d+†source】/g) || [];
//   console.log('Trechos removidos:', matches); // Log dos trechos
//   return text.replace(/【\d+:\d+†source】/g, '').trim();
// }

// const Chatbot = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false); // Controle de abertura do chat
//   const [messages, setMessages] = useState([]); // Armazena as mensagens (excluindo a de boas-vindas)
//   const [input, setInput] = useState(''); // Gerencia o texto do usuário
//   const [isLoading, setIsLoading] = useState(false); // Estado para o carregamento
//   const messagesEndRef = useRef(null); // Ref para rastrear o final da lista de mensagens

//   // Rolagem automática para o final
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, isLoading]);

//   const getMessages = async () => {
//     if (input.trim() === '') return;

//     // Adicione a mensagem do usuário ao estado
//     const userMessage = { sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);

//     // Verifica se há uma mensagem anterior da AI
//     const lastBotMessage = messages.slice().reverse().find((msg) => msg.sender === 'bot');

//     // Constrói a string no formato desejado
//     const userInput = `resposta anterior: ${lastBotMessage ? lastBotMessage.text : ''} pergunta atual: ${input}`;

//     const apiPayload = {
//       userInput,
//     };

//     console.log('Payload para API:', apiPayload);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const options = {
//         method: 'POST',
//         body: JSON.stringify({
//           messages: userInput,
//         }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };
    
//       // Timeout de 30 segundos
//       const fetchWithTimeout = (url, options, timeout = 30000) => {
//         return Promise.race([
//           fetch(url, options),
//           new Promise((_, reject) =>
//             setTimeout(() => reject(new Error('Tempo limite atingido')), timeout)
//           ),
//         ]);
//       };
//       console.log(process.env.REACT_APP_BACKEND_URL);
//       console.log(options)
//       const response = await fetchWithTimeout(`${process.env.REACT_APP_BACKEND_URL}/threads`, options);

    
//       if (!response.ok) {
//         console.error('Erro ao se conectar à API:', response.statusText);
//         const errorMessage = { sender: 'bot', text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente perguntar novamente, por favor.' };
//         setMessages((prev) => [...prev, errorMessage]);
//         return;
//       }
    
//       const data = await response.json();
//       const rawBotResponse = data.messages[0].content[0].text.value;
//       const botResponse = cleanText(rawBotResponse);
    
//       const botMessage = { sender: 'bot', text: botResponse };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Erro:', error.message);
//       const errorMessage = { sender: 'bot', text: error.message === 'Ops: tempo limite atingido. Tente perguntar de outra forma' ? 'Ops: tempo limite atingido. Tente perguntar de outra forma' : 'Desculpe, ocorreu um erro ao se conectar ao serviço. Tente novamente em alguns minutos.' };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//    return (
//     <>
//       {/* Botão Flutuante */}
//       {!isChatOpen && (
//         <Fab
//           color="primary"
//           aria-label="Chatbot"
//           onClick={() => setIsChatOpen(true)}
//           sx={{
//             position: 'fixed',
//             bottom: 16,
//             right: 16,
//             backgroundColor: '#4caf50',
//             '&:hover': { backgroundColor: '#388e3c' },
//           }}
//         >
//           <Chat />
//         </Fab>
//       )}

//       {/* Ambiente de Chat */}
//       {isChatOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             bottom: 16,
//             right: 16,
//             width: 360,
//             height: 500,
//             backgroundColor: '#1e1e1e',
//             color: '#fff',
//             borderRadius: 2,
//             boxShadow: 3,
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               padding: 2,
//               backgroundColor: '#292929',
//               borderTopLeftRadius: 8,
//               borderTopRightRadius: 8,
//             }}
//           >
//             <Typography variant="h6">Iara por MCS Markup</Typography>
//             <IconButton onClick={() => setIsChatOpen(false)} sx={{ color: '#fff' }}>
//               <Close />
//             </IconButton>
//           </Box>

//           {/* Mensagens */}
//           <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
//             <List>
//               {/* Mensagem de Boas-Vindas */}
//               <ListItem
//                 sx={{
//                   justifyContent: 'flex-start',
//                   mb: 1,
//                 }}
//               >
//                 <Paper
//                   sx={{
//                     p: 2,
//                     backgroundColor: '#292929',
//                     color: '#fff',
//                     maxWidth: '70%',
//                   }}
//                 >
//                   Olá! Sou a Iara, a Inteligência Aumentada de Respostas Avançadas da MCS Markup. Estou aqui para ajudar com suas dúvidas sobre políticas e procedimentos. <br></br> O que você gostaria de saber?
//                 </Paper>
//               </ListItem>

//               {/* Outras Mensagens */}
//               {messages.map((message, index) => (
//                 <ListItem
//                   key={index}
//                   sx={{
//                     justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
//                     mb: 1,
//                   }}
//                 >
//                   <Paper
//                     sx={{
//                       p: 2,
//                       backgroundColor: message.sender === 'user' ? '#4caf50' : '#292929',
//                       color: '#fff',
//                       maxWidth: '70%',
//                     }}
//                   >
//                     {message.text}
//                   </Paper>
//                 </ListItem>
//               ))}
//               {isLoading && (
//                 <ListItem sx={{ justifyContent: 'flex-start', mb: 1 }}>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       color: '#fff',
//                       gap: 1,
//                     }}
//                   >
//                     <CircularProgress size={20} color="inherit" />
//                     <Typography variant="body2">Pesquisando resposta...</Typography>
//                   </Box>
//                 </ListItem>
//               )}
//               <div ref={messagesEndRef} />
//             </List>
//           </Box>

//           {/* Campo de Entrada */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               padding: 2,
//               backgroundColor: '#292929',
//               borderBottomLeftRadius: 8,
//               borderBottomRightRadius: 8,
//             }}
//           >
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Write your message here..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && getMessages()}
//               sx={{
//                 backgroundColor: '#1e1e1e',
//                 borderRadius: 1,
//                 '& .MuiOutlinedInput-root': {
//                   color: '#fff',
//                   '& fieldset': { borderColor: '#4caf50' },
//                   '&:hover fieldset': { borderColor: '#66bb6a' },
//                   '&.Mui-focused fieldset': { borderColor: '#81c784' },
//                 },
//               }}
//             />
//             <IconButton onClick={getMessages} sx={{ color: '#4caf50', ml: 1 }}>
//               <Send />
//             </IconButton>
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default Chatbot;

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
