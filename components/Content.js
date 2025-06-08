export default function HTMLContent({ content, className }) {
  // It's good practice to ensure content is a string before setting __html
  const htmlContent = typeof content === 'string' ? content : '';
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
