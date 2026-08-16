import{getAuthConfig,completeAuthCallback,getSession,signInOAuth,signInPassword,signUpPassword,normalizeLang,safeNext}from'/auth-client.js?v=20260816-1';

const qs=new URLSearchParams(location.search);
let lang=normalizeLang(qs.get('lang')||localStorage.getItem('lumen-lang')||'ko');
const next=safeNext(qs.get('next')||'/');
let mode='login';
const $=id=>document.getElementById(id);
const copy={
ko:{title:'루멘 명운 로그인',intro:'인연지도와 Guardian 서비스를 안전하게 이어서 사용하려면 로그인해 주세요.',protected:'개인정보 보호를 위해 로그인이 필요한 서비스입니다.',login:'로그인',signup:'직접 가입',email:'이메일',password:'비밀번호',loginBtn:'이메일로 로그인',signupBtn:'이메일로 가입',or:'또는',google:'Google로 계속',x:'X로 계속',facebook:'Facebook으로 계속',privacy:'로그인 계정은 서비스 접근과 본인 데이터 구분에만 사용하며, 사주 계산에 입력한 원본 생년월일·출생시간은 계정에 저장하지 않는 원칙을 유지합니다.',privacyLink:'개인정보처리방침',terms:'이용약관',setup:'로그인 화면은 준비되었습니다. 실제 로그인 활성화를 위해 Supabase 프로젝트 연결과 Google·X·Facebook OAuth 키 설정이 필요합니다.',wait:'로그인 처리 중입니다…',signed:'로그인되었습니다. 이동합니다…',checkMail:'가입 요청이 완료되었습니다. 받은 편지함에서 이메일 인증을 완료해 주세요.',error:'로그인을 완료하지 못했습니다. 입력값과 계정 설정을 확인해 주세요.'},
en:{title:'Sign in to Lumen Destiny',intro:'Sign in to continue using Connection Map and Guardian services securely.',protected:'Sign-in is required to protect your personal data.',login:'Sign in',signup:'Create account',email:'Email',password:'Password',loginBtn:'Sign in with email',signupBtn:'Create account with email',or:'or',google:'Continue with Google',x:'Continue with X',facebook:'Continue with Facebook',privacy:'Your account is used only for service access and separating your data. Original birth date and birth time entered for Saju calculations are still not stored in your account.',privacyLink:'Privacy Policy',terms:'Terms of Use',setup:'The login UI is ready. Connect a Supabase project and configure Google, X and Facebook OAuth credentials to activate sign-in.',wait:'Signing you in…',signed:'Signed in. Redirecting…',checkMail:'Account request received. Please verify your email from your inbox.',error:'Unable to complete sign-in. Check your details and provider setup.'},
ja:{title:'ルーメン命運にログイン',intro:'ご縁マップとGuardianサービスを安全に続けて利用するためログインしてください。',protected:'個人情報保護のためログインが必要です。',login:'ログイン',signup:'新規登録',email:'メールアドレス',password:'パスワード',loginBtn:'メールでログイン',signupBtn:'メールで登録',or:'または',google:'Googleで続ける',x:'Xで続ける',facebook:'Facebookで続ける',privacy:'アカウントはサービスへのアクセスと本人データの区分にのみ使用します。四柱計算で入力した元の生年月日・出生時刻をアカウントに保存しない原則を維持します。',privacyLink:'プライバシーポリシー',terms:'利用規約',setup:'ログイン画面は準備済みです。実際に有効化するにはSupabaseプロジェクト接続とGoogle・X・FacebookのOAuth設定が必要です。',wait:'ログイン処理中…',signed:'ログインしました。移動します…',checkMail:'登録を受け付けました。メール認証を完了してください。',error:'ログインを完了できませんでした。入力内容と設定を確認してください。'},
tl:{title:'Mag-sign in sa Lumen Destiny',intro:'Mag-sign in para ligtas na magpatuloy sa Connection Map at Guardian services.',protected:'Kailangang mag-sign in upang maprotektahan ang personal data.',login:'Mag-sign in',signup:'Gumawa ng account',email:'Email',password:'Password',loginBtn:'Mag-sign in gamit email',signupBtn:'Gumawa ng account gamit email',or:'o',google:'Magpatuloy gamit Google',x:'Magpatuloy gamit X',facebook:'Magpatuloy gamit Facebook',privacy:'Ginagamit ang account para sa service access at paghihiwalay ng iyong data. Hindi pa rin sine-save sa account ang orihinal na birth date at birth time para sa Saju calculation.',privacyLink:'Patakaran sa Privacy',terms:'Mga Tuntunin',setup:'Handa na ang login screen. Kailangan ikonekta ang Supabase at i-configure ang Google, X at Facebook OAuth para ma-activate.',wait:'Nag-sign in…',signed:'Naka-sign in na. Lilipat na…',checkMail:'Natanggap ang signup. I-verify ang email mula sa inbox.',error:'Hindi nakumpleto ang sign-in. Suriin ang detalye at provider setup.'},
vi:{title:'Đăng nhập Lumen Destiny',intro:'Đăng nhập để tiếp tục sử dụng Bản đồ quan hệ và Guardian một cách an toàn.',protected:'Cần đăng nhập để bảo vệ dữ liệu cá nhân.',login:'Đăng nhập',signup:'Tạo tài khoản',email:'Email',password:'Mật khẩu',loginBtn:'Đăng nhập bằng email',signupBtn:'Tạo tài khoản bằng email',or:'hoặc',google:'Tiếp tục với Google',x:'Tiếp tục với X',facebook:'Tiếp tục với Facebook',privacy:'Tài khoản chỉ được dùng để truy cập dịch vụ và tách dữ liệu của từng người. Ngày sinh và giờ sinh gốc nhập để tính Tứ trụ vẫn không được lưu vào tài khoản.',privacyLink:'Chính sách riêng tư',terms:'Điều khoản sử dụng',setup:'Màn hình đăng nhập đã sẵn sàng. Cần kết nối dự án Supabase và cấu hình OAuth Google, X, Facebook để kích hoạt.',wait:'Đang đăng nhập…',signed:'Đã đăng nhập. Đang chuyển trang…',checkMail:'Đã nhận yêu cầu đăng ký. Vui lòng xác minh email trong hộp thư.',error:'Không thể hoàn tất đăng nhập. Hãy kiểm tra thông tin và cấu hình nhà cung cấp.'},
zh:{title:'登录 Lumen Destiny',intro:'登录后可安全继续使用缘分地图和 Guardian 服务。',protected:'为保护个人信息，使用此服务需要登录。',login:'登录',signup:'注册账号',email:'邮箱',password:'密码',loginBtn:'使用邮箱登录',signupBtn:'使用邮箱注册',or:'或',google:'使用 Google 继续',x:'使用 X 继续',facebook:'使用 Facebook 继续',privacy:'账号仅用于服务访问和区分本人数据。四柱计算中输入的原始出生日期与时间仍不会保存到账号中。',privacyLink:'隐私政策',terms:'使用条款',setup:'登录界面已准备完成。实际启用前需要连接 Supabase 项目，并配置 Google、X、Facebook OAuth。',wait:'正在登录…',signed:'已登录，正在跳转…',checkMail:'注册请求已提交，请在邮箱中完成验证。',error:'无法完成登录，请检查输入内容和登录提供商设置。'}
};
const T=copy[lang];

function applyCopy(){
  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  localStorage.setItem('lumen-lang',lang);
  $('loginTitle').textContent=T.title;
  $('loginIntro').textContent=T.intro;
  $('protectedNotice').textContent=T.protected;
  $('tabLogin').textContent=T.login;$('tabSignup').textContent=T.signup;
  $('emailLabel').textContent=T.email;$('passwordLabel').textContent=T.password;
  $('emailSubmit').textContent=mode==='login'?T.loginBtn:T.signupBtn;
  document.querySelector('.login-divider span').textContent=T.or;
  document.querySelector('[data-social-label="google"]').textContent=T.google;
  document.querySelector('[data-social-label="x"]').textContent=T.x;
  document.querySelector('[data-social-label="facebook"]').textContent=T.facebook;
  $('loginPrivacy').textContent=T.privacy;
  const links=document.querySelectorAll('.login-legal a');if(links[0])links[0].textContent=T.privacyLink;if(links[1])links[1].textContent=T.terms;
  document.querySelectorAll('.login-languages button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  $('authPassword').autocomplete=mode==='login'?'current-password':'new-password';
}
function setMode(nextMode){mode=nextMode;$('tabLogin').classList.toggle('active',mode==='login');$('tabSignup').classList.toggle('active',mode==='signup');$('tabLogin').setAttribute('aria-selected',mode==='login'?'true':'false');$('tabSignup').setAttribute('aria-selected',mode==='signup'?'true':'false');applyCopy()}
function message(text,success=false){const el=$('authMessage');el.textContent=text||'';el.classList.toggle('success',!!success)}
function busy(on){document.querySelector('.login-card').setAttribute('aria-busy',on?'true':'false')}
function remember(session){if(session?.user?.id){localStorage.setItem('lumen-auth-user-id',session.user.id);if(session.user.email)localStorage.setItem('lumen-auth-user-email',session.user.email)}}
function go(){const target=new URL(next,location.origin);if(!target.searchParams.has('lang'))target.searchParams.set('lang',lang);location.replace(target.toString())}

async function init(){
  applyCopy();
  if(qs.get('reason')==='protected')$('protectedNotice').hidden=false;
  document.querySelectorAll('.login-languages button').forEach(b=>b.addEventListener('click',()=>{const u=new URL(location.href);u.searchParams.set('lang',b.dataset.lang);localStorage.setItem('lumen-lang',b.dataset.lang);location.href=u.toString()}));
  $('tabLogin').addEventListener('click',()=>setMode('login'));
  $('tabSignup').addEventListener('click',()=>setMode('signup'));

  const cfg=await getAuthConfig();
  if(!cfg?.enabled){
    $('setupNotice').hidden=false;$('setupNotice').textContent=T.setup;
    document.querySelectorAll('.social-button,.email-auth-form input,.email-submit').forEach(el=>el.disabled=true);
    return;
  }

  document.querySelectorAll('.social-button').forEach(btn=>{
    const supported=cfg.methods?.[btn.dataset.provider]!==false;
    btn.hidden=!supported;
    btn.disabled=!supported;
  });
  if(cfg.methods?.email===false)document.querySelector('.email-auth-form').hidden=true;

  try{
    if(qs.get('code')||qs.get('auth')==='callback'){
      busy(true);message(T.wait);
      const session=await completeAuthCallback();
      if(session?.user){remember(session);message(T.signed,true);setTimeout(go,180);return}
    }
    const existing=await getSession();
    if(existing?.user){remember(existing);message(T.signed,true);setTimeout(go,180);return}
  }catch(e){message(e?.message||T.error)}finally{busy(false)}

  document.querySelectorAll('.social-button').forEach(btn=>btn.addEventListener('click',async()=>{
    try{busy(true);message(T.wait);await signInOAuth(btn.dataset.provider,next)}catch(e){busy(false);message(e?.message||T.error)}
  }));

  $('emailAuthForm').addEventListener('submit',async e=>{
    e.preventDefault();const email=$('authEmail').value.trim(),password=$('authPassword').value;
    try{
      busy(true);message(T.wait);
      if(mode==='login'){
        const data=await signInPassword(email,password);const session=data?.session||null;
        if(!session?.user)throw new Error(T.error);remember(session);message(T.signed,true);setTimeout(go,180);
      }else{
        const data=await signUpPassword(email,password,next);const session=data?.session||null;
        if(session?.user){remember(session);message(T.signed,true);setTimeout(go,180)}else message(T.checkMail,true);
      }
    }catch(err){message(err?.message||T.error)}finally{busy(false)}
  });
}

init();
