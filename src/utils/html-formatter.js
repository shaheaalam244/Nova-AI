const formatContentToHTML = (content) => {
    if (!content) return '';

    let formatted = content;

    // Code blocks with syntax container styling
    formatted = formatted.replace(/```([\s\S]*?)```/g, (match, p1) => {
        const code = p1.trim();
        return `<div class="code-container"><div class="code-header"><span>Code Snippet</span></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
    });

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headings
    formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes
    formatted = formatted.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bullet points
    formatted = formatted.replace(/^\* (.*$)/gim, '<li>$1</li>');
    formatted = formatted.replace(/^- (.*$)/gim, '<li>$1</li>');
    
    // Numbered lists
    formatted = formatted.replace(/^\d+\.\s+(.*$)/gim, '<li class="numbered-li">$1</li>');

    // Wrap continuous <li> into <ul> or <ol>
    formatted = formatted.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');

    // Paragraph breaks for double newlines
    const paragraphs = formatted.split(/\n\n+/);
    return paragraphs.map(p => {
        p = p.trim();
        if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<div') || p.startsWith('<blockquote')) {
            return p;
        }
        return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
};

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export default formatContentToHTML;
