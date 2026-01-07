import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Tooltip, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import image from './../assets/backimage.jpg'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UserAvatar from './../assets/assitant.webp'
import AssistantAvatar from './../assets/user.jpeg'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from "axios";


export default function Chat({ setSpeaking }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const messagesEndRef = useRef(null);
    const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const fileType = file.type.includes('image') ? 'image' : 'document';


            setMessages((prev) => [
                ...prev,
                {
                    text: file.name,
                    sender: 'user',
                    file: fileUrl,
                    type: fileType,
                    fileName: file.name,
                },
            ]);


            const aiReply = `You uploaded a ${fileType === 'image' ? 'picture' : 'document'}.`;


            setMessages((prev) => [
                ...prev,
                {
                    text: aiReply,
                    sender: 'assistant',
                },
            ]);
        }
    };



    const handleAttachClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        } else {
            console.error('File input ref is null.');
        }
    };


    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        console.log(utterance);

        console.log(text);


        if (input === "Marathi") {
            utterance.lang = 'hi-IN';
            console.log("Hi I am marathi");

        }
        else {

            utterance.lang = 'en-US'
        }


        setSpeaking(true);

        utterance.onend = () => {
            setSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };



    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser.");
            return;
        }





        if (!recognition) {


            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.lang = 'en-US';
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            let finalTranscript = '';
            let debounceTimeout;




            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }


                clearTimeout(debounceTimeout);


                debounceTimeout = setTimeout(() => {
                    if (finalTranscript.trim()) {
                        sendMessage(finalTranscript.trim());
                        finalTranscript = '';
                    }
                }, 1000);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognitionInstance.onend = () => {
                setIsRecording(false);
                console.log('Speech recognition ended.');
            };

            setRecognition(recognitionInstance);
            recognitionInstance.start();
        } else {

            recognition.stop();
            setRecognition(null);
        }

        setIsRecording((prev) => !prev);
    };

    // const sendMessage = (message) => {
    //     if (!message.trim()) return;

    //     setMessages((prev) => [...prev, { text: message, sender: 'user' }]);

    //     // const aiReplyList = [
    //     //     "खात्रीने! सुरक्षेच्या कारणास्तव, कृपया आपल्या ऑनलाइन बँकिंग खात्यात लॉग इन करा किंवा आमचा मोबाइल अ‍ॅप वापरा. एकदा लॉग इन केल्यानंतर, आपले चालू आणि उपलब्ध शिल्लक आपल्या डॅशबोर्डवर पाहू शकता.",
    //     //     "Certainly! For security purposes, please log in to your online banking account or use our mobile app. Once logged in, you can view your current and available balance on your dashboard."
    //     // ];


    //     // const isMarathi = message === "Marathi";

    //     // const aiReply = isMarathi ? aiReplyList[0] : aiReplyList[1];
    //     // console.log(aiReply);


    //     setTimeout(() => {
    //         setMessages((prev) => [...prev, { text: aiReply, sender: 'assistant' }]);
    //         speak(aiReply);
    //     }, 200);
    //     setInput('')
    // };

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { text: message, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "deepseek/deepseek-r1-0528:free",
                    messages: [
                        {
                            role: "user",
                            content: message,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: 'Bearer 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',
                        "Content-Type": "application/json",
                        // "HTTP-Referer": "https://www.sitename.com", // optional
                        // "X-Title": "React AI Chat", // optional
                    },
                }
            );

            const aiReply =
                response.data.choices[0].message.content || "No response";

            setMessages((prev) => [
                ...prev,
                { text: aiReply, sender: "assistant" },
            ]);

            speak(aiReply);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    text: "⚠️ Something went wrong. Please try again.",
                    sender: "assistant",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };




    const copyMessage = (text, index) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedMessageIndex(index);
                setTimeout(() => setCopiedMessageIndex(null), 2000);
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    };


    const deleteMessage = (index) => {
        setMessages((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleReaction = (index, type) => {
        setMessages((prev) =>
            prev.map((msg, i) => {
                if (i === index) {
                    return { ...msg, [type]: (msg[type] || 0) + 1 };
                }
                return msg;
            })
        );
    };



    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',

                // backgroundColor: "aliceblue",
                padding: 2,
                position: 'relative',
                // backgroundImage: `url(${image})`,
                // backgroundSize: 'cover',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
            }}
        >




            {isRecording && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#f76a3fff',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                        animation: 'pulse 1.5s infinite',
                        zIndex: 1000,
                    }}
                >
                    🎙️ Listening...
                </Box>
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    marginBottom: 2,

                    '&::-webkit-scrollbar': {
                        width: '2px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c52ff3ff',
                        borderRadius: '2px'

                    },

                }}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: 1,
                            padding: '1rem'

                        }}
                    >
                        {msg.sender === 'assistant' && (
                            <Avatar
                                alt="Assistant"
                                src={UserAvatar}
                                sx={{ width: 32, height: 32, marginRight: 1 }}
                            />
                        )}
                        <Box
                            sx={{
                                maxWidth: { xs: '90%', md: '70%' },
                                padding: '10px 14px',
                                borderRadius: '18px',
                                backgroundColor: msg.sender === 'user' ? '#c52ff3ff' : '#e4e6eb',
                                color: msg.sender === 'user' ? '#fff' : '#000',
                                borderTopLeftRadius: msg.sender === 'user' ? '18px' : '4px',
                                borderTopRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                fontSize: { xs: '1rem', md: '1.2rem' },
                            }}
                        >
                            {msg.type === 'image' ? (
                                <a href={msg.file} download={msg.fileName}>
                                    <img src={msg.file} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                </a>
                            ) : msg.type === 'document' ? (
                                <a href={msg.file} download={msg.fileName}>
                                    {msg.text}
                                </a>
                            ) : (
                                msg.text
                            )}

                        </Box>


                        {msg.sender === 'user' && (
                            <Avatar
                                alt="User"
                                src={AssistantAvatar}
                                sx={{ width: 32, height: 32, marginLeft: 1 }}
                            />
                        )}
                        {msg.sender === 'assistant' && (
                            <Box sx={{ width: '100%', marginTop: 1 }}>



                                <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                                    <Tooltip title="Like" arrow>
                                        <Button
                                            onClick={() => handleReaction(index, 'likes')}
                                            size="small"
                                            sx={{
                                                color: '#1976d2',
                                                '&:hover': {
                                                    color: '#1565c0',
                                                },
                                            }}
                                        >
                                            <ThumbUpIcon fontSize="small" />
                                            {msg.likes > 0 && msg.likes}
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Dislike" arrow>
                                        <Button
                                            onClick={() => handleReaction(index, 'dislikes')}
                                            size="small"
                                            sx={{
                                                color: '#d32f2f',
                                                '&:hover': {
                                                    color: '#c62828',
                                                },
                                            }}
                                        >
                                            <ThumbDownIcon fontSize="small" />
                                            {msg.dislikes > 0 && msg.dislikes}
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 1 }}>
                                    <Tooltip title="Copy" arrow>
                                        <Button
                                            onClick={() => copyMessage(msg.text, index)}
                                            size="small"
                                            sx={{
                                                color: '#f1e9e9ff',
                                                '&:hover': {
                                                    color: '#f1e9e9ff',
                                                },
                                            }}
                                        >
                                            {copiedMessageIndex === index ? (
                                                <CheckCircleIcon fontSize="small" />
                                            ) : (
                                                <ContentCopyIcon fontSize="small" />
                                            )}
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Delete" arrow>
                                        <Button
                                            onClick={() => deleteMessage(index)}
                                            size="small"
                                            sx={{
                                                color: '#d32f2f',
                                                '&:hover': {
                                                    color: '#b71c1c',
                                                },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>
                        )}
                    </Box>
                ))}
                {loading && (

                    <Box
                        sx={{
                            
                            color: "#999",
                            mt: 1,
                            fontStyle: "italic",
                        }}
                    >
                        <Box
                        sx={{
                            display:"flex",
                            alignItems:"center",
                            gap:"5px"
                        }}
                        >
                         <Avatar
                            alt="User"
                            src={UserAvatar}
                            sx={{ width: 32, height: 32, marginLeft: 1 }}
                        />
                         Elena is typing...
                        </Box>
                        
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{
                display: 'flex', gap: 1, alignItems: 'center',
            }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Type a message..."
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 12px",
                        borderRadius: '25px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '25px',
                            '& fieldset': {
                                border: 'none',
                            },
                            '&:hover fieldset': {
                                borderColor: 'green',
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: 2,
                            },
                        },
                        '& input': {
                            padding: '12px 14px',
                            fontSize: '1rem',
                        },
                        maxWidth: { xs: 'calc(100% - 72px)', md: 'calc(100% - 72px)' },
                    }}
                />


                <Button
                    variant="contained"
                    sx={{
                        height: '3.5rem',
                        width: '3.5rem',
                        borderRadius: '50%',
                        backgroundColor: '#6d6a6aff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={handleAttachClick}
                >
                    <AttachFileIcon sx={{ fontSize: '1.5rem' }} />
                    <input
                        type="file"
                        accept="image/*, .doc, .pdf, .txt, .jpg, .png"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                </Button>
                <Button
                    variant="contained"
                    onClick={() => sendMessage(input)}
                    sx={{
                        height: { xs: '3.5rem', sm: '3.5rem' },
                        width: { xs: '3.5rem', sm: '3.5rem' },
                        borderRadius: '50%',
                        backgroundColor: '#2e7d32',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: '#25812d',
                        },
                    }}
                >
                    <SendIcon sx={{ fontSize: { xs: '1.5rem', } }} />

                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleVoiceInput}
                    sx={{
                        height: { xs: '3.5rem', sm: '3.5rem' },
                        width: { xs: '3.5rem', sm: '3.5rem' },
                        borderRadius: '50%',
                        backgroundColor: '#ac1ed6',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: '#9b00b3',
                        },
                    }}
                >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                </Button>
            </Box>
        </Box>
    );
}


