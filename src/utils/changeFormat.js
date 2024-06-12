// Function to format date in "YYYY년 MM월 DD일" format
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
};

export const formatDate_time = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};

export const formatDate_time2 = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export function addHours(dateTimeString) {
    const date = new Date(dateTimeString);
    date.setHours(date.getHours() + 9);
    return date.toISOString();
}


export const formatDate2 = (createdAt, expiredAt) => {
    const createdDate = new Date(createdAt);
    const expiredDate = new Date(expiredAt);

    const createdYear = createdDate.getFullYear();
    const createdMonth = (createdDate.getMonth() + 1).toString().padStart(2, '0');
    const createdDay = createdDate.getDate().toString().padStart(2, '0');
    const createdHour = createdDate.getHours().toString().padStart(2, '0');
    const createdMinute = createdDate.getMinutes().toString().padStart(2, '0');

    const expiredYear = expiredDate.getFullYear();
    const expiredMonth = (expiredDate.getMonth() + 1).toString().padStart(2, '0');
    const expiredDay = expiredDate.getDate().toString().padStart(2, '0');
    const expiredHour = expiredDate.getHours().toString().padStart(2, '0');
    const expiredMinute = expiredDate.getMinutes().toString().padStart(2, '0');

    if (createdYear === expiredYear && createdMonth === expiredMonth && createdDay === expiredDay) {
        return `${createdMonth}월 ${createdDay}일 ${createdHour}시 ${createdMinute}분 ~ ${expiredHour}시 ${expiredMinute}분`;
    } else {
        return `${createdMonth}월 ${createdDay}일 ${createdHour}시 ${createdMinute}분 ~ ${expiredDay}일 ${expiredHour}시 ${expiredMinute}분`;
    }
};



export function formatPeriod(currentTime, expiredAt) {
    // 주어진 문자열을 Date 객체로 변환
    const currentTimeObj = new Date(currentTime);
    const expiredAtObj = new Date(expiredAt);

    // 만료 시간에서 현재 시간을 빼서 남은 시간 계산
    const timeDifference = expiredAtObj - currentTimeObj;

    // 시간과 분 계산
    const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // 결과 반환
    return `"${hoursRemaining}시간 ${minutesRemaining}분"`;
}