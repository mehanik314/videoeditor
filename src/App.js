import React, { useState } from 'react';
import JSZip from 'jszip';

function App() {
  const [mainVideos, setMainVideo] = useState(null);
  const [videoURLs, setVideoURLs] = useState([]);
  const [transition, setTransition] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [additionalKeywords, setAdditionalKeywords] = useState('');

  const handleMainVideoChange = (event) => {
    setMainVideo(event.target.files);
  };

  const handleCheckboxChange = () => {
    setTransition(!transition);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleAdditionalKeywordsChange = (event) => {
    setAdditionalKeywords(event.target.value);
  };

  const handleConcatenateVideos = async () => {
    const formData = new FormData();
    for (let i = 0; i < mainVideos.length; i++) {
      formData.append('main_videos', mainVideos[i]);
    }
    formData.append('transition', transition ? '1' : '0');
    formData.append('keywords', keywords);
    formData.append('additional_keywords', additionalKeywords);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки видео');
      }

      
      const blob = await response.blob();
      const zip = new JSZip();
      
      const content = await zip.loadAsync(blob);
      const urls = [];
      
      for(const fileName of Object.keys(content.files)) {
        const fileData = await content.files[fileName].async("blob");
        const url = URL.createObjectURL(fileData);
        urls.push(url);
      }
      setVideoURLs(urls);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Upload Videos</h1>
      <input type="file" onChange={handleMainVideoChange} accept="video/mp4" multiple />
      <input type="text" placeholder="Ключевые слова" value={keywords} onChange={handleKeywordsChange} />
      <input type="text" placeholder="Дополнительные ключевые слова" value={additionalKeywords} onChange={handleAdditionalKeywordsChange} />
      <button onClick={handleConcatenateVideos}>Объединить видео</button>
      <div className='transition'>
        <input type='checkbox' onChange={handleCheckboxChange} checked={transition}/>
        <p>Плавный переход</p>
      </div>
      {videoURLs.map((url, index) => (
        <video key={index} controls src={url} width='860' height='480' />
      ))}
    </div>
  );
}

export default App;