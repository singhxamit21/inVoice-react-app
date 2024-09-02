
export const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

export const dateToString = (date) => {
    const displayOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    const newDate = new Date(date).toLocaleString('en-GB', displayOptions);

    return newDate;
};



export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const checkInappropriateStr = (value) => {
    if (value) {
        return value.match(/<[^>]+>/g);
    }
    return false;
}

export const displayNumberInIndianFormat = (p_Number, p_bWithSign) => {
    if (p_Number === 0) {
        if (p_bWithSign) {
            return `${ruppesSymbolCode}0.00`
        }
        return "0";
    }
    if (p_Number) {
        if (p_bWithSign) {
            return p_Number.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            })
        }
        return p_Number.toLocaleString('en-IN');
    }
    return "";
}

export const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
    const digits = Math.floor(1000 + Math.random() * 9000); 
    return `#${letter1}${letter2}${digits}`;
}




