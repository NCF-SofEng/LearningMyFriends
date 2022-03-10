const translations = {
    'bangla': {
        "edit": "সম্পাদনা",
        "delete": "মুছে ফেলা",
        "draw": "বর্ণনা",
        "eval": "পরীক্ষা",
        "background": "পটভূমি",
        "undo": "পূর্ববর্তী",
        "redo": "রেডিও",
        "save": "সংরক্ষণ",
        "load": "লোড",
        "export": "রপ্তানি",
        "run code": "কোড চালান",
        "manipulate": "সংযোগ",
        "text": "পাঠ",
        "image": "চিত্র",
        "brush size": "বর্ণনা সাইজ",
        "brush color": "বর্ণনা রং",
        "clear": "পরিষ্কার",
        "font size": "ফন্ট সাইজ",
        "font family": "ফন্ট পরিষ্কার"
    }
}

export function t(word, locale = "english") {
    const word = word.toLowerCase();

    if (locale === "english") {
        return word;
    };

    if (translations[locale] && translations[locale][word]) {
        return translations[locale][word];
    } else {
        return word;
    }
}