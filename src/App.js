import React, { useState } from 'react';
import JSZip from 'jszip';
function App() {
  const [mainVideos, setMainVideos] = useState([]);
  const [videoURLs, setVideoURLs] = useState([]);
  const [segmentsInput, setSegmentsInput] = useState('');

  const handleMainVideoChange = (event) => {
    setMainVideos(event.target.files);
  };

  const handleSegmentsInputChange = (event) => {
    setSegmentsInput(event.target.value);
  };

  const handleConcatenateVideos = async () => {
    if (!mainVideos || mainVideos.length === 0) {
      alert("Please select at least one video file.");
      return;
    }

    // Задаем последовательности напрямую в коде
    const sequences = [
      ["20 лет.mp4", "Девочка.mp4", "Мужчина.mp4"],
      ["Мужчина.mp4","20 лет.mp4"],
      ["20 лет.mp4", "Женщина.mp4", "Михаил.mp4"],
      ["21 год.mp4", "Мальчик.mp4", "Кирилл.mp4"],
      ["22 года.mp4", "20 лет.mp4"],
      ["22 года.mp4", "20 лет.mp4", "Денис.mp4"]
    ];

    const formData = new FormData();
    formData.append('sequences', JSON.stringify(sequences));  // Добавление JSON как строки
    formData.append('segments', segmentsInput);  // Добавление информации о сегментах
    for (let i = 0; i < mainVideos.length; i++) {
      formData.append('main_videos', mainVideos[i]);
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки видео');
      }

      // Предположим, что сервер возвращает URL сгенерированных видео
      // const urlData = await response.json();
      // setVideoURLs(urlData.files);  // Обновляем состояние с URL видео
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Upload Videos</h1>
      <input type="file" onChange={handleMainVideoChange} accept="video/mp4" multiple />
      <input type="text" placeholder="Enter segments or timestamps" value={segmentsInput} onChange={handleSegmentsInputChange} />
      <button onClick={handleConcatenateVideos}>Объединить видео</button>
      {videoURLs.map((url, index) => (
        <video key={index} controls src={url} width='860' height='480' />
      ))}
    </div>
  );
}

export default App;