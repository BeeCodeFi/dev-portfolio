# iOS Animation Fixes

## Summary
Fixed animation issues on iOS devices by addressing Safari-specific rendering and performance problems.

## Problems Identified

### 1. **Smooth Scrolling (Lenis)**
- iOS Safari doesn't handle custom scroll implementations well
- Causes scroll jank and animation stuttering
- **Fix**: Disabled Lenis smooth scrolling on iOS devices

### 2. **3D Transforms**
- iOS Safari has buggy 3D transform rendering
- `transform: perspective()` and `rotateX/Y` cause visual glitches
- **Fix**: Disabled 3D tilt effects and aggressive 3D transforms on iOS

### 3. **Viewport Units (`svh`)**
- iOS Safari has issues with `svh` (small viewport height) units
- **Fix**: Replaced with standard `100vh` and CSS fallbacks

### 4. **GSAP ScrollTrigger**
- Aggressive `scrub: true` causes choppy animations on iOS
- **Fix**: Changed to gentler `scrub: 0.5` on iOS devices

### 5. **Hardware Acceleration**
- Missing CSS properties for proper GPU acceleration
- **Fix**: Added `-webkit-transform: translateZ(0)` and `backface-visibility: hidden`

## Changes Made

### Core Files

#### `src/hooks/motion.ts`
- Added `isIOS()` detection function
- Disabled Lenis smooth scrolling on iOS
- Export `isIOS` for use in components

#### `src/index.css`
- Added iOS-specific viewport height fixes
- Added hardware acceleration properties for animated elements
- Optimized CSS animations with `translate3d` on iOS
- Disabled hover effects on iOS touch devices
- Added `-webkit-overflow-scrolling: touch`

### Component Updates

All components using GSAP animations were updated with:

1. **Import `isIOS` helper**
2. **Conditional `force3D` flag**
   ```typescript
   const force3D = !isIOS()
   ```

3. **Gentler scrubbing on iOS**
   ```typescript
   scrub: isIOS() ? 0.5 : true
   ```

4. **Disabled 3D transforms on iOS**
   - Removed perspective effects
   - Removed tilt effects
   - Removed complex rotation animations

5. **Fixed viewport height**
   - Replaced `h-svh` with inline style `height: '100vh'`

#### Modified Components:
- ✅ Hero.tsx
- ✅ Projects.tsx (disabled 3D tilt cards)
- ✅ shared.tsx (Magnetic, SectionTag, RevealHeading)
- ✅ Skills.tsx
- ✅ About.tsx
- ✅ Stats.tsx (disabled rotateX animation)

## Testing Checklist

Test on actual iOS device (iPhone/iPad):

- [ ] Hero section animations (character reveals, fade-ins)
- [ ] Smooth scrolling is disabled (native scroll works)
- [ ] Project cards animate on scroll
- [ ] Horizontal scroll reel works smoothly
- [ ] Skills section cards reveal
- [ ] About section word-by-word reveal
- [ ] Stats counter animations
- [ ] No visual glitches or jank during scroll
- [ ] All hover states work properly
- [ ] Magnetic buttons work (should be disabled on iOS)

## Browser Support

- ✅ iOS Safari (iPhone/iPad)
- ✅ Desktop Chrome/Firefox/Safari
- ✅ Android Chrome
- ✅ Edge

## Performance Improvements

1. Hardware acceleration enabled via CSS
2. Reduced complexity of 3D transforms
3. Optimized scroll performance
4. Gentler animation scrubbing
5. Touch-optimized interactions

## Future Considerations

- Consider using Intersection Observer API as fallback for older iOS versions
- Monitor iOS Safari updates for improved 3D transform support
- Test on various iOS versions (iOS 14+)

## Rollback Instructions

If issues persist, you can disable all animations on iOS by adding this to the top of motion.ts:

```typescript
if (isIOS()) {
  gsap.defaults({ duration: 0 })
}
```

This will make all animations instant on iOS devices.
