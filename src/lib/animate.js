export default function animate (options) {
  if (typeof window === 'undefined') {
    return;
  }

  const start = window.performance.now();

  window.requestAnimationFrame(function animate (time) {
    let timeFraction = (time - start) / options.duration;

    if (timeFraction > 1) {
      timeFraction = 1;
    }

    var progress = options.timing(timeFraction);

    options.draw(progress);

    if (timeFraction < 1) {
      window.requestAnimationFrame(animate);
    }
  });
}
