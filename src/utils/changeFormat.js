// Function to format date in "YYYY년 MM월 DD일" format
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
};

export function formatPeriod(timeRange) {
    const [startTime, endTime] = timeRange.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // 시작 시간 변환
    let startPeriod = '오전';
    let startConvertedHour = startHour;
    if (startHour >= 12) {
        startPeriod = '오후';
        startConvertedHour = startHour === 12 ? 12 : startHour - 12;
    }
    let startConvertedMinute = startMinute === 0 ? '' : `${startMinute}분`;

    // 종료 시간 변환
    let endPeriod = '오전';
    let endConvertedHour = endHour;
    if (endHour >= 12) {
        endPeriod = '오후';
        endConvertedHour = endHour === 12 ? 12 : endHour - 12;
    }
    let endConvertedMinute = endMinute === 0 ? '' : `${endMinute}분`;

    // 출력 형식 조합
    const startFormatted = `${startPeriod} ${startConvertedHour}시 ${startConvertedMinute}`;
    const endFormatted = `${endPeriod} ${endConvertedHour}시 ${endConvertedMinute}`;

    return `${startFormatted} ~ ${endFormatted}`;
}