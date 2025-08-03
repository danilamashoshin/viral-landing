# Viral Animation Landing Page

A high-converting landing page for an online animation course that teaches creators how to make viral animated videos.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with breakpoints at 640px, 768px, 1024px, and 1280px
- **Interactive Elements**:
  - Real-time countdown timer (48 hours, saved in localStorage)
  - Exit-intent popup (desktop only)
  - Social proof notifications
  - Smooth scroll animations
  - Progress bar showing page scroll
  - Sticky header with mini CTA
  - Sticky buy button on mobile
  - Parallax effects on desktop

- **Design System**:
  - Primary Color: Electric purple (#8B5CF6)
  - Secondary Color: Bright yellow (#FCD34D)
  - Background: Light cream (#FEF3E7)
  - Font: Inter (loaded from Google Fonts)

## 📁 Project Structure

```
animator/
├── index.html          # Main landing page
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── README.md           # This file
└── images/             # Media files directory
```

## 🖼️ Required Media Files

Place the following images in the `images/` directory:

1. **Alena.jpeg** - Instructor photo
2. **woman1.jpeg** - Testimonial photo for Sarah M.
3. **man2.jpeg** - Testimonial photo for James K.
4. **woman2.jpeg** - Testimonial photo for Lisa T.

## 📝 Placeholder Elements

The following elements are implemented as placeholders and can be replaced with actual content:

1. **Student Work Videos** - 6 gray placeholder blocks in the testimonials section
2. **30-Day Guarantee Badge** - Gray circular placeholder in the guarantee section
3. **Payment Icons** - Text placeholder for payment method icons
4. **Google Analytics** - GA_MEASUREMENT_ID needs to be replaced with actual ID
5. **Facebook Pixel** - Placeholder comment for future implementation

## 🚀 Getting Started

1. Clone or download the project files
2. Add the required images to the `images/` directory
3. Open `index.html` in a web browser
4. Replace placeholder content as needed

## 💻 Technical Implementation

### Countdown Timer
- Automatically sets a 48-hour countdown on first visit
- Saves end time in localStorage
- Persists across page refreshes

### Social Proof Notifications
- Shows random notifications every 15-30 seconds
- Displays in bottom-left corner
- Randomizes from 10 different names and 4 message types

### Exit Intent Popup
- Triggers when mouse leaves viewport (desktop only)
- Shows only once per session
- Can be closed by clicking X or outside the popup

### CTA Tracking
- All CTA buttons have data-location attributes for tracking
- Google Analytics event tracking ready (needs GA ID)
- Smooth scroll to pricing section on click

### Performance Optimizations
- Lazy loading ready for images (add data-src attributes)
- CSS animations use transform for better performance
- Minimal JavaScript with efficient event handling

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #8B5CF6;
    --secondary-color: #FCD34D;
    --background-cream: #FEF3E7;
    /* ... other variables ... */
}
```

### Modifying Content
- All text content is in `index.html`
- Styling is fully separated in `styles.css`
- Interactive features are in `script.js`

### Adding Real Videos
Replace placeholder blocks with actual YouTube embeds:
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>
```

## 📱 Mobile Optimization

- Full-width CTAs on mobile
- Sticky buy button appears after 50% scroll
- Simplified navigation
- Touch-friendly tap targets (min 44px)
- Reduced animations for better performance

## 🔧 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox for layout
- ES6 JavaScript features
- Intersection Observer API for scroll animations

## 📈 Future Enhancements

1. Add real payment integration
2. Implement email capture functionality
3. Add video modal for student work gallery
4. Integrate actual analytics and tracking pixels
5. Add A/B testing capabilities
6. Implement form validation and submission

## 🤝 Contributing

Feel free to submit issues or pull requests to improve the landing page.

## 📄 License

This project is created for educational and commercial use. 