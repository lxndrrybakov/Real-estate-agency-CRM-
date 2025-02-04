export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Ensure the number starts with 7
  const number = cleaned.startsWith('7') ? cleaned : '7' + cleaned;
  
  // Format the number
  if (number.length > 0) {
    let formatted = '+7';
    if (number.length > 1) formatted += ` (${number.slice(1, 4)}`;
    if (number.length > 4) formatted += `) ${number.slice(4, 7)}`;
    if (number.length > 7) formatted += `-${number.slice(7, 9)}`;
    if (number.length > 9) formatted += `-${number.slice(9, 11)}`;
    return formatted;
  }
  
  return '+7';
}

export function formatDateTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}