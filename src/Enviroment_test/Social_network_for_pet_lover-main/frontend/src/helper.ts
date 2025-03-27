export function formatDate(input: Date | string|undefined): string {
    // Nếu input là chuỗi, chuyển nó thành đối tượng Date
    const date = typeof input === "string" ? new Date(input) : input;
    if(date===undefined) return "";
    const day = date.getDate().toString().padStart(2, '0'); // Ngày với hai chữ số
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng với hai chữ số (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm

    return `${day}-${month}-${year}`;
}
export const getTimeAgo = (dateInput: Date): string => {
  const inputDate = new Date(dateInput);
  const currentDate = new Date();
  const diffInSeconds = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    // Định dạng ngày giờ theo kiểu "6 December at 11:49"
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return inputDate.toLocaleString('en-US', options);
  }
};

export const calculateAge = (birthDate: string|undefined): string => {
  if(birthDate===undefined)  return"";
  const today = new Date();
  const birth = new Date(birthDate);

  // Tính năm và tháng
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  // Điều chỉnh nếu tháng hiện tại nhỏ hơn tháng sinh
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return years>0 ? `${years} tuổi và ${months} tháng` : `${months} tháng`;
};
  