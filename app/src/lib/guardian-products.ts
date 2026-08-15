export type GuardianProduct={key:string;tier:'basic'|'custom'|'rare'|'legendary';price:number;limit:number;name:string;element:'목'|'화'|'토'|'금'|'수';wish:string;image:string};

export const GUARDIAN_PRODUCTS:GuardianProduct[]=[
 {key:'fortune-cat',tier:'basic',price:5,limit:100,name:'행운냥이',element:'금',wish:'행운 · 재물 · 번성',image:'https://lh3.googleusercontent.com/d/1vcq5keNb0iC9wY9tdW9sh27_ZVj7laZs'},
 {key:'koi',tier:'basic',price:5,limit:100,name:'비단잉어',element:'수',wish:'출세 · 합격 · 도약',image:'https://lh3.googleusercontent.com/d/1fzkTRNyjVmG4pKI6fn_PA7gta6inpRDH'},
 {key:'sun-bird',tier:'basic',price:5,limit:100,name:'아기 봉황',element:'화',wish:'기쁨 · 좋은 소식 · 활력',image:'https://lh3.googleusercontent.com/d/1hiCQRc83h1ESULCyqZciFYIpiGHlL_k3'},
 {key:'new-deer',tier:'basic',price:5,limit:100,name:'새벽사슴',element:'목',wish:'새로운 시작 · 성장',image:'https://lh3.googleusercontent.com/d/1Ktk7KPaSLIsyJet2_rqla80F1coWhrJS'},
 {key:'gold-hamster',tier:'basic',price:5,limit:100,name:'복다람',element:'토',wish:'모으기 · 지킴 · 풍요',image:'https://lh3.googleusercontent.com/d/1tpGPrXFaXuryiSGgYZaeip-ibQ_Eekj6'},
 {key:'moon-rabbit',tier:'custom',price:10,limit:100,name:'달토끼',element:'금',wish:'인연성취 · 행복',image:'https://lh3.googleusercontent.com/d/13-YwL5hk3O31CVBsHUQnw_a_5hwKEqvG'},
 {key:'dolphin',tier:'custom',price:10,limit:100,name:'소망돌고래',element:'수',wish:'기회 · 여행 · 자유',image:'https://lh3.googleusercontent.com/d/1Fzbof7KfYYeYTl9FMNa3gGb8o5zoJbxP'},
 {key:'fire-fox',tier:'custom',price:10,limit:100,name:'불여우',element:'화',wish:'열정 · 자신감 · 행운',image:'https://lh3.googleusercontent.com/d/1bqc1ItCJ9IkXxKysNuCZBsfV3Pjq4zAA'},
 {key:'leaf-turtle',tier:'custom',price:10,limit:100,name:'잎새거북',element:'목',wish:'건강 · 안정 · 보호',image:'https://lh3.googleusercontent.com/d/1b4612N6zwefB4usZHxLlROzIIf_j3Ptl'},
 {key:'star-owl',tier:'custom',price:10,limit:100,name:'별부엉이',element:'토',wish:'학업 · 합격 · 목표달성',image:'https://lh3.googleusercontent.com/d/1LP9IswkRQWhKVbc2pa4pMQyL4h7tWelW'},
 {key:'nine-fox',tier:'rare',price:50,limit:5,name:'백호',element:'금',wish:'수호 · 승리 · 권위',image:'https://lh3.googleusercontent.com/d/1dpyr-Oahao-jS191c1MdaGqw8QonjOuP'},
 {key:'sea-dragon',tier:'rare',price:50,limit:5,name:'청룡',element:'목',wish:'성장 · 기회 · 도약',image:'https://lh3.googleusercontent.com/d/1wVv81JwtAkbqpYGzeKI5x9LL1ghN4Wtr'},
 {key:'unicorn',tier:'rare',price:50,limit:5,name:'주작',element:'화',wish:'열정 · 성공 · 명예',image:'https://lh3.googleusercontent.com/d/1ODIg1x6-jm206jcFn2U5qsYn3kUaaJIh'},
 {key:'forest-turtle',tier:'rare',price:50,limit:5,name:'현무',element:'수',wish:'안정 · 보호 · 장수',image:'https://lh3.googleusercontent.com/d/1xAHVhJhm3ILYdK_sWMBOZKQ5SvYlw503'},
 {key:'wing-owl',tier:'rare',price:50,limit:5,name:'황금기린',element:'토',wish:'재물 · 번영 · 행운',image:'https://lh3.googleusercontent.com/d/1HjlgNl6h2NuLl3clWCtJevKCnYDY7ZW2'},
 {key:'sky-dragon',tier:'legendary',price:100,limit:1,name:'백룡',element:'금',wish:'성공 · 권위 · 개운',image:'https://lh3.googleusercontent.com/d/1qUQk3cYWSKvELS19XH5UJso3ExU-Whin'},
 {key:'fire-phoenix',tier:'legendary',price:100,limit:1,name:'주작',element:'화',wish:'열정 · 재물 · 승진',image:'https://lh3.googleusercontent.com/d/1RbwAFl7iBO1SA_N-grLHUwdJN6uM6xCC'},
 {key:'moon-tiger',tier:'legendary',price:100,limit:1,name:'청호',element:'목',wish:'수호 · 극복 · 도약',image:'https://lh3.googleusercontent.com/d/1ayHVJXsUbtGrYPhdxWdzEU6LnNmGlEbM'},
 {key:'qilin',tier:'legendary',price:100,limit:1,name:'녹기린',element:'토',wish:'번영 · 성장 · 행운',image:'https://lh3.googleusercontent.com/d/1UvYrUeWOstshsi3DRyaVh8yLb2sSCtaP'},
 {key:'black-turtle',tier:'legendary',price:100,limit:1,name:'현무',element:'수',wish:'안정 · 장수 · 보호',image:'https://lh3.googleusercontent.com/d/1KfrRx0K_svFe0myWVliYf5sbuPaRz-Fh'}
];

export const TIER_LABEL={basic:'BASIC',custom:'PERSONAL WISH',rare:'RARE EDITION',legendary:'LEGENDARY 1/1'} as const;
