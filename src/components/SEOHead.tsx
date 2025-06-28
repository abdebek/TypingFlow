import React from 'react';

export function SEOHead() {
  React.useEffect(() => {
    // Update meta tags for better social sharing
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const updateNameTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Open Graph tags
    updateMetaTag('og:title', 'TypingFlow - Modern Typing Experience');
    updateMetaTag('og:description', 'Experience the future of typing tests with real-time analytics, interactive tutorials, and gamified challenges. Built for 2025.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', 'https://typing.waanfeetan.com');
    updateMetaTag('og:image', 'https://typing.waanfeetan.com/og-image.png');

    // Twitter Card tags
    updateNameTag('twitter:card', 'summary_large_image');
    updateNameTag('twitter:title', 'TypingFlow - Modern Typing Experience');
    updateNameTag('twitter:description', 'Experience the future of typing tests with real-time analytics, interactive tutorials, and gamified challenges. Built for 2025.');
    updateNameTag('twitter:image', 'https://typing.waanfeetan.com/og-image.png');

    // Additional meta tags
    updateNameTag('description', 'Modern typing test platform with real-time analytics, interactive tutorials, and gamified challenges. Experience the future of typing practice in 2025.');
    updateNameTag('keywords', 'typing test, WPM, words per minute, typing speed, keyboard training, typing practice, typing tutor, 2025, modern typing');
    updateNameTag('author', 'TypingFlow');

    // Update title
    document.title = 'TypingFlow - Modern Typing Experience';
  }, []);

  return null;
}