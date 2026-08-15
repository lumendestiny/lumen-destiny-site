(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(window.__LUMEN_LANG__||qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';
  else if(lang.startsWith('ja'))lang='ja';
  else if(lang.startsWith('vi'))lang='vi';
  else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';
  else if(lang.startsWith('en'))lang='en';
  else lang='ko';
  if(lang==='ko')return;

  const path=location.pathname.replace(/\/$/,'').replace(/\.html$/,'');
  const pages={
    en:{
      terms:{title:'Terms of Use | Lumen Destiny',hero:'Terms of Use',intro:'These terms explain the conditions for using Lumen Destiny and the principles for digital content.',sections:[
        ['Nature of the service','Saju, compatibility and fortune interpretations are reference content based on traditional culture and do not guarantee any specific future, exam, financial, health or relationship outcome.'],
        ['Free interpretations and paid content','Basic Saju and fortune interpretations are provided free of charge in principle. Optional digital content such as Guardian may be offered as a separate purchase.'],
        ['Payment and refunds','Guardian is personalized digital content issued for the purchaser. Detailed rules for cancellation before payment, issuance after payment verification, sold-out cases, duplicate payments, system errors and refund limitations after personalized issuance are governed by the public <a href="/refund-policy.html">Refund & Cancellation Policy</a>. If applicable law or a payment provider policy gives consumers stronger rights, those rules take priority.'],
        ['Stories and events','Success stories are made public only with separate customer consent. We do not describe Guardian as the cause of an outcome. Selection criteria and quantities for Physical Guardian events follow the notice for each event.'],
        ['Service changes','Features, prices and payment structure may change before launch. The terms will be finalized based on the actual operating structure before commercial release.']
      ]},
      refund:{title:'Refund & Cancellation Policy | Lumen Destiny',hero:'Refund & Cancellation Policy',intro:'Guardian is personalized digital content issued after an order. These rules are published so customers can review them before payment.',sections:[
        ['1. Cancellation before payment','You may stop payment at any time before payment is completed. If you close or cancel the payment window, Guardian is not issued.'],
        ['2. Payment confirmation and issuance','A browser payment-success screen alone does not issue Guardian. Guardian is issued only after the payment provider server confirmation (Webhook) is complete, the order amount, currency and order number match server records, and available limited-edition inventory is confirmed.'],
        ['3. Automatic refund after payment','If payment succeeds but the last limited unit was assigned to another customer first during simultaneous purchases, the order moves to refund-pending status. The customer is not asked to pay again and a refund process is initiated for the same payment.'],
        ['4. Duplicate payment and system errors','If a clear duplicate payment or system error is confirmed, order and payment records are reviewed and the duplicate amount is refunded. Customers should not repeatedly pay the same order and should first check the payment-status page or contact support.'],
        ['5. After personalized digital content is issued','Guardian is personalized using information entered by the purchaser, such as a name, wish or message. After payment is normally confirmed and the personalized Guardian is issued, refunds for a simple change of mind may be limited. If applicable law, payment-provider policy or consumer-protection rules provide stronger rights, those rules take priority.'],
        ['6. Issuance errors','If payment completes normally but Guardian is not issued because of a server error, or a clearly different file or issue number is delivered from the order, we first attempt correct issuance or correction. If the issue cannot reasonably be resolved, refund eligibility is reviewed.'],
        ['7. Refund status','A refund request or automatic refund is managed using pending / processing / refunded / failed states. The actual time for a refund to appear may vary depending on the payment provider, card issuer or bank.'],
        ['8. Dissatisfaction with an outcome is not a refund reason','Guardian is symbolic digital encouragement content and does not guarantee passing an exam, employment, promotion, financial results, health recovery, relationship improvement or any other future result. Not receiving an expected real-world result alone is not a refund reason.'],
        ['9. Support','For refund or payment-status questions, prepare the Guardian order number and payment time. Do not send full card numbers, passwords, security codes or other sensitive payment information to support.']
      ],notice:'※ This policy may be adjusted before formal launch to reflect payment-provider approval and applicable laws in the countries where sales actually occur.'},
      privacy:{title:'Privacy Policy | Lumen Destiny',hero:'Privacy Policy',intro:'Lumen Destiny follows the principle of processing only the minimum information needed to provide the service.',sections:[
        ['1. Free Saju and compatibility input','Values entered by the user, such as a name or nickname, date of birth, birth time, gender and calendar type, are used to calculate and display results. V1 free Saju and compatibility input is not designed on the assumption that it will be stored long-term in a separate member database.'],
        ['2. Guardian orders and verification','During Guardian issuance preparation, information needed to process the order may be handled, including display name, selected tier and wish category, gift status and necessary gift information, order identifier, and payment/issuance status. The public verification screen is designed not to store or expose the wish text or sensitive payment information.'],
        ['3. Payment information','Do not send full card numbers, passwords, security codes or other sensitive payment information to Lumen Destiny support. When payment is enabled, actual payment information is handled in the connected payment provider’s secure payment environment.'],
        ['4. Face photos','Face-photo upload is not included in the V1 public scope. If face reading is released later, a separate notice and consent process will be provided before upload. Original photos will be processed only for the minimum time needed for analysis and then automatically deleted, and will not be stored or reused in member accounts, admin screens, analysis records or backups.'],
        ['5. User requests','Requests concerning deletion, correction or processing of personal information are accepted at the email below. Only the minimum information needed to verify the request is checked.']
      ],contact:'Contact and privacy requests: llumendestiny@gmail.com',home:'Back to home'},
      support:{title:'Support | Lumen Destiny',hero:'Support',intro:'Contact us about service use, Guardian issuance and verification, payment status, or privacy requests.',cards:[
        ['Service use','If there is a problem with Saju results, compatibility, language selection or screen display, please include the device used and a screenshot when possible.'],
        ['Guardian','For questions about issue numbers, verification, gifts, stories or Physical Guardian events, include the Guardian issue number.'],
        ['Payment and refunds','After payment is enabled, include the Guardian order number and payment time for payment or refund questions. Do not send full card numbers, passwords, security codes or other sensitive payment information.'],
        ['Privacy','Deletion, correction and processing requests are accepted through the contact email, and only the minimum information needed to verify the request is checked.'],
        ['Contact email','<strong>llumendestiny@gmail.com</strong>']
      ],notice:'※ The V1 public scope is free Saju, fortunes, compatibility and Guardian. 1:1 consultation is not currently public.',footer:['Privacy Policy','Terms of Use','Refund & Cancellation','Guardian']}
    },
    ja:{
      terms:{title:'利用規約 | Lumen Destiny',hero:'利用規約',intro:'Lumen Destinyのサービス利用条件とデジタルコンテンツ利用の原則をご案内します。',sections:[
        ['サービスの性格','四柱・相性・運勢の解釈は伝統文化に基づく参考コンテンツであり、未来・合格・金銭・健康・関係など特定の結果を保証しません。'],
        ['無料解説と有料コンテンツ','基本の四柱・運勢解説は原則無料で提供し、Guardianなどの選択型デジタルコンテンツは別途購入項目として運営する場合があります。'],
        ['決済・返金','Guardianは個別にパーソナライズして発行されるデジタルコンテンツです。決済前のキャンセル、決済確認後の発行、完売・重複決済・システムエラー、個別発行後の返金制限などの詳細は公開された<a href="/refund-policy.html">返金・キャンセルポリシー</a>に従います。適用法令または決済事業者の方針がより強い消費者の権利を定める場合は、その基準が優先されます。'],
        ['体験談とイベント','成功体験談の公開はお客様の別途同意を得た場合にのみ行い、Guardianが結果の原因であると断定する表現は使用しません。Physical Guardianイベントの選定基準と数量は各イベントの案内に従います。'],
        ['サービス変更','正式公開前に機能・価格・決済構造が変更される場合があり、商用公開前に実際の運営構造を基準として規約を最終確定します。']
      ]},
      refund:{title:'返金・キャンセルポリシー | Lumen Destiny',hero:'返金・キャンセルポリシー',intro:'Guardianは注文後に個別化して発行されるデジタルコンテンツです。以下の基準を決済前に確認できるよう公開します。',sections:[
        ['1. 決済前のキャンセル','決済が完了する前であればいつでも決済を中止できます。決済画面を閉じる、またはキャンセルした場合、Guardianは発行されません。'],
        ['2. 決済確認と発行時点','ブラウザ上の決済成功表示だけではGuardianは発行されません。決済事業者のサーバー確認（Webhook）が完了し、注文金額・通貨・注文番号がサーバー記録と一致し、該当限定版の発行可能数量が確認された後にのみ発行されます。'],
        ['3. 決済後の自動返金対象','決済は成功したものの、同時購入により最後の限定数量が他のお客様に先に割り当てられ発行できない場合、注文は返金待ち状態になります。追加決済は求めず、同じ決済に対する返金手続きを進めます。'],
        ['4. 重複決済・システムエラー','システムエラーまたは明らかな重複決済が確認された場合、注文・決済記録を確認したうえで重複分を返金します。同じ注文を繰り返し決済せず、まず決済状態画面またはサポートで状態を確認してください。'],
        ['5. 個別化デジタルコンテンツ発行後','Guardianは購入者が入力した名前・願い・メッセージなどに応じて個別化して発行されます。正常に決済が確認され、個別化Guardianが発行された後は、単純な心変わりを理由とする返金が制限される場合があります。ただし適用法令、決済事業者の方針、または消費者保護規定がより強い権利を認める場合はその規定が優先されます。'],
        ['6. 発行エラー','決済は正常に完了したもののサーバーエラーでGuardianが発行されない場合、または注文内容と明らかに異なるファイル・発行番号が提供された場合は、まず正常発行または訂正を行い、合理的な範囲で解決できない場合に返金可否を検討します。'],
        ['7. 返金処理状態','返金申請または自動返金が作成されると、pending / processing / refunded / failedの状態で管理します。決済事業者・カード会社・銀行の処理状況により、実際の返金反映時期は異なる場合があります。'],
        ['8. 結果への不満は返金理由ではありません','Guardianは試験合格、就職、昇進、金銭的成果、健康回復、関係改善、その他の未来の結果を保証しない象徴的なデジタル応援コンテンツです。期待した現実の結果が起きなかったことだけを理由に返金対象とはなりません。'],
        ['9. サポート','返金または決済状態のお問い合わせ時はGuardian注文番号と決済時刻をご用意ください。カード番号全体、パスワード、セキュリティコードなどの機密決済情報をサポートへ送らないでください。']
      ],notice:'※ 本ポリシーは決済事業者の承認および実際の販売国の関連法令に合わせ、正式公開前に追加調整される場合があります。'},
      privacy:{title:'プライバシーポリシー | Lumen Destiny',hero:'プライバシーポリシー',intro:'Lumen Destinyはサービス提供に必要な最小限の情報のみを取り扱うことを原則とします。',sections:[
        ['1. 無料四柱・相性入力','氏名またはニックネーム、生年月日、出生時刻、性別、暦の種類など、ユーザーが入力した値は結果の計算と画面表示に使用します。現在のV1無料四柱・相性入力値は、別途会員DBへ長期保存することを前提としていません。'],
        ['2. Guardian注文・認証','Guardian発行準備では、表示名、選択した等級・願い分野、ギフトの有無と必要なギフト情報、注文識別番号、決済・発行状態など、注文処理に必要な情報を取り扱う場合があります。公開認証画面には願い本文や機密決済情報を保存・表示しない構造を使用します。'],
        ['3. 決済情報','カード番号全体、パスワード、セキュリティコードなどの機密決済情報をLumen Destinyのサポートへ送らないでください。決済機能が有効になる場合、実際の決済情報は接続された決済事業者の安全な決済環境で処理されます。'],
        ['4. 顔写真','V1公開範囲には観相用の顔写真アップロード機能を含みません。将来観相機能を公開する場合は、アップロード前に別途告知と同意手続きを設け、分析に必要な最短時間のみ処理した後、元画像を自動削除し、会員アカウント・管理画面・分析記録・バックアップに元画像を保存・再利用しない原則を適用します。'],
        ['5. ユーザーからの依頼','個人情報の削除・訂正・処理に関するお問い合わせは下記メールで受け付け、依頼確認に必要な最小限の情報のみを確認します。']
      ],contact:'お問い合わせ・個人情報に関する依頼: llumendestiny@gmail.com',home:'ホームへ戻る'},
      support:{title:'サポート | Lumen Destiny',hero:'サポート',intro:'サービス利用、Guardian発行・認証、決済状態、個人情報に関するお問い合わせを受け付けます。',cards:[
        ['サービス利用','四柱結果、相性、言語選択または画面表示に問題がある場合は、使用した端末と画面の情報をあわせてお知らせください。'],
        ['Guardian','発行番号・認証・ギフト・体験談・Physical Guardianイベントに関するお問い合わせ時はGuardian発行番号をお知らせください。'],
        ['決済・返金','決済機能の有効化後、決済または返金のお問い合わせ時はGuardian注文番号と決済時刻をお知らせください。カード番号全体、パスワード、セキュリティコードなどの機密決済情報は送らないでください。'],
        ['個人情報','削除・訂正・処理に関する依頼はお問い合わせメールで受け付け、確認に必要な最小限の情報のみを確認します。'],
        ['お問い合わせメール','<strong>llumendestiny@gmail.com</strong>']
      ],notice:'※ V1公開範囲は無料四柱・運勢・相性とGuardianであり、1:1相談機能は現在公開していません。',footer:['プライバシーポリシー','利用規約','返金・キャンセル','Guardian']}
    },
    tl:{
      terms:{title:'Terms of Use | Lumen Destiny',hero:'Terms of Use',intro:'Ipinapaliwanag dito ang mga kundisyon sa paggamit ng Lumen Destiny at mga prinsipyo para sa digital content.',sections:[
        ['Uri ng serbisyo','Ang Saju, compatibility at fortune interpretations ay reference content batay sa tradisyunal na kultura at hindi garantiya ng partikular na future, exam, financial, health o relationship result.'],
        ['Libreng paliwanag at paid content','Ang basic Saju at fortune interpretations ay libre sa prinsipyo. Ang optional digital content tulad ng Guardian ay maaaring hiwalay na bilhin.'],
        ['Payment at refund','Ang Guardian ay personalized digital content na ini-issue para sa purchaser. Ang detalyadong rules para sa cancellation bago payment, issuance matapos ma-verify ang payment, sold-out, duplicate payment, system error at refund limitations matapos ang personalized issuance ay ayon sa public <a href="/refund-policy.html">Refund & Cancellation Policy</a>. Kung nagbibigay ang applicable law o payment-provider policy ng mas malakas na consumer rights, iyon ang masusunod.'],
        ['Stories at events','Ang success stories ay inilalathala lamang kapag may hiwalay na consent ng customer. Hindi namin inilalarawan ang Guardian bilang dahilan ng resulta. Ang selection criteria at quantity ng Physical Guardian events ay ayon sa notice ng bawat event.'],
        ['Pagbabago ng serbisyo','Maaaring magbago ang features, presyo at payment structure bago ang launch. Ang terms ay ia-finalize batay sa aktuwal na operating structure bago ang commercial release.']
      ]},
      refund:{title:'Refund & Cancellation Policy | Lumen Destiny',hero:'Refund & Cancellation Policy',intro:'Ang Guardian ay personalized digital content na ini-issue pagkatapos ng order. Inilalathala ang rules na ito para mabasa ng customer bago magbayad.',sections:[
        ['1. Cancellation bago payment','Maaaring ihinto ang payment anumang oras bago ito makumpleto. Kapag isinara o kinansela ang payment window, hindi mai-issue ang Guardian.'],
        ['2. Payment confirmation at issuance','Hindi sapat ang browser payment-success screen para ma-issue ang Guardian. Mai-issue lamang ito matapos makumpleto ang server confirmation (Webhook) ng payment provider, tumugma ang amount, currency at order number sa server record, at makumpirma ang available limited-edition inventory.'],
        ['3. Automatic refund pagkatapos ng payment','Kung successful ang payment pero na-assign muna sa ibang customer ang huling limited unit sa sabayang purchase, magiging refund-pending ang order. Hindi hihingan ng panibagong bayad ang customer at sisimulan ang refund para sa parehong payment.'],
        ['4. Duplicate payment at system error','Kung makumpirma ang malinaw na duplicate payment o system error, rerepasuhin ang order at payment records at ire-refund ang duplicate amount. Huwag ulit-ulitin ang payment para sa parehong order; tingnan muna ang payment-status page o kumontak sa support.'],
        ['5. Pagkatapos ma-issue ang personalized digital content','Personalized ang Guardian ayon sa pangalan, wish, message at iba pang inilagay ng purchaser. Kapag normal na nakumpirma ang payment at na-issue na ang personalized Guardian, maaaring limitado ang refund dahil lamang sa pagbabago ng isip. Kung nagbibigay ang applicable law, payment-provider policy o consumer-protection rule ng mas malakas na karapatan, iyon ang masusunod.'],
        ['6. Issuance error','Kung normal na nakumpleto ang payment pero hindi na-issue ang Guardian dahil sa server error, o malinaw na ibang file o issue number ang naibigay kumpara sa order, susubukan muna ang tamang issuance o correction. Kung hindi ito maresolba nang makatwiran, rerepasuhin ang refund eligibility.'],
        ['7. Refund status','Ang refund request o automatic refund ay pinamamahalaan gamit ang pending / processing / refunded / failed states. Maaaring mag-iba ang aktuwal na oras ng pag-reflect ng refund depende sa payment provider, card issuer o bank.'],
        ['8. Hindi refund reason ang dissatisfaction sa outcome','Ang Guardian ay symbolic digital encouragement content at hindi garantiya ng pagpasa sa exam, employment, promotion, financial result, health recovery, relationship improvement o iba pang future result. Ang hindi pagkakaroon ng inaasahang real-world result lamang ay hindi dahilan para sa refund.'],
        ['9. Support','Para sa refund o payment-status question, ihanda ang Guardian order number at oras ng payment. Huwag ipadala sa support ang buong card number, password, security code o ibang sensitive payment information.']
      ],notice:'※ Maaaring baguhin ang policy na ito bago ang formal launch upang umayon sa payment-provider approval at applicable laws sa mga bansang aktuwal na pagbebentahan.'},
      privacy:{title:'Privacy Policy | Lumen Destiny',hero:'Privacy Policy',intro:'Prinsipyo ng Lumen Destiny na iproseso lamang ang minimum na impormasyong kailangan para maibigay ang serbisyo.',sections:[
        ['1. Free Saju at compatibility input','Ang values na inilagay ng user gaya ng name o nickname, date of birth, birth time, gender at calendar type ay ginagamit para kalkulahin at ipakita ang results. Ang V1 free Saju at compatibility input ay hindi dinisenyo sa palagay na pangmatagalang ise-save sa hiwalay na member database.'],
        ['2. Guardian orders at verification','Sa Guardian issuance preparation, maaaring iproseso ang impormasyong kailangan sa order tulad ng display name, selected tier at wish category, gift status at kailangang gift information, order identifier, at payment/issuance status. Ang public verification screen ay dinisenyo na huwag mag-save o maglabas ng wish text o sensitive payment information.'],
        ['3. Payment information','Huwag ipadala ang buong card number, password, security code o ibang sensitive payment information sa Lumen Destiny support. Kapag enabled ang payment, ang aktuwal na payment information ay pinoproseso sa secure payment environment ng connected payment provider.'],
        ['4. Face photos','Hindi kasama ang face-photo upload sa V1 public scope. Kung ilalabas sa hinaharap ang face reading, magkakaroon ng hiwalay na notice at consent bago upload. Ang original photo ay ipoproseso lamang sa minimum na oras na kailangan para sa analysis at awtomatikong buburahin pagkatapos; hindi ito ise-save o gagamitin muli sa member account, admin screen, analysis record o backup.'],
        ['5. User requests','Ang requests para sa deletion, correction o processing ng personal information ay tinatanggap sa email sa ibaba. Minimum na impormasyong kailangan lamang para i-verify ang request ang hihingin.']
      ],contact:'Contact at privacy requests: llumendestiny@gmail.com',home:'Bumalik sa home'},
      support:{title:'Support | Lumen Destiny',hero:'Support',intro:'Makipag-ugnayan tungkol sa paggamit ng serbisyo, Guardian issuance at verification, payment status o privacy requests.',cards:[
        ['Paggamit ng serbisyo','Kung may problema sa Saju result, compatibility, language selection o screen display, isama ang ginamit na device at screenshot kung maaari.'],
        ['Guardian','Para sa issue number, verification, gift, story o Physical Guardian event questions, isama ang Guardian issue number.'],
        ['Payment at refund','Kapag enabled na ang payment, isama ang Guardian order number at payment time sa payment o refund questions. Huwag ipadala ang buong card number, password, security code o ibang sensitive payment information.'],
        ['Privacy','Ang deletion, correction at processing requests ay tinatanggap sa contact email, at minimum na impormasyong kailangan lamang para i-verify ang request ang hihingin.'],
        ['Contact email','<strong>llumendestiny@gmail.com</strong>']
      ],notice:'※ Ang V1 public scope ay free Saju, fortunes, compatibility at Guardian. Hindi kasalukuyang public ang 1:1 consultation.',footer:['Privacy Policy','Terms of Use','Refund & Cancellation','Guardian']}
    },
    vi:{
      terms:{title:'Điều khoản sử dụng | Lumen Destiny',hero:'Điều khoản sử dụng',intro:'Trang này giải thích điều kiện sử dụng Lumen Destiny và nguyên tắc sử dụng nội dung số.',sections:[
        ['Tính chất dịch vụ','Các diễn giải Tứ trụ, hợp tuổi và vận mệnh là nội dung tham khảo dựa trên văn hóa truyền thống, không bảo đảm bất kỳ kết quả cụ thể nào về tương lai, thi cử, tài chính, sức khỏe hoặc quan hệ.'],
        ['Diễn giải miễn phí và nội dung trả phí','Các diễn giải Tứ trụ và vận mệnh cơ bản được cung cấp miễn phí theo nguyên tắc. Nội dung số tùy chọn như Guardian có thể được bán riêng.'],
        ['Thanh toán và hoàn tiền','Guardian là nội dung số được cá nhân hóa và phát hành cho người mua. Quy định chi tiết về hủy trước thanh toán, phát hành sau khi xác minh thanh toán, hết hàng, thanh toán trùng, lỗi hệ thống và giới hạn hoàn tiền sau khi phát hành cá nhân hóa tuân theo <a href="/refund-policy.html">Chính sách hoàn tiền và hủy</a> công khai. Nếu luật áp dụng hoặc chính sách của nhà cung cấp thanh toán trao quyền lợi mạnh hơn cho người tiêu dùng, quy định đó được ưu tiên.'],
        ['Câu chuyện và sự kiện','Câu chuyện thành công chỉ được công khai khi có sự đồng ý riêng của khách hàng. Chúng tôi không mô tả Guardian là nguyên nhân tạo ra kết quả. Tiêu chí lựa chọn và số lượng của sự kiện Physical Guardian tuân theo thông báo của từng sự kiện.'],
        ['Thay đổi dịch vụ','Tính năng, giá và cấu trúc thanh toán có thể thay đổi trước khi ra mắt. Điều khoản sẽ được hoàn thiện dựa trên cấu trúc vận hành thực tế trước khi phát hành thương mại.']
      ]},
      refund:{title:'Chính sách hoàn tiền và hủy | Lumen Destiny',hero:'Chính sách hoàn tiền và hủy',intro:'Guardian là nội dung số được cá nhân hóa và phát hành sau khi đặt hàng. Các tiêu chuẩn dưới đây được công khai để khách hàng xem trước khi thanh toán.',sections:[
        ['1. Hủy trước khi thanh toán','Bạn có thể dừng thanh toán bất kỳ lúc nào trước khi hoàn tất. Nếu đóng hoặc hủy cửa sổ thanh toán, Guardian sẽ không được phát hành.'],
        ['2. Xác nhận thanh toán và thời điểm phát hành','Chỉ màn hình báo thanh toán thành công trên trình duyệt không đủ để phát hành Guardian. Guardian chỉ được phát hành sau khi xác nhận máy chủ (Webhook) của nhà cung cấp thanh toán hoàn tất, số tiền, đơn vị tiền tệ và mã đơn hàng khớp với bản ghi máy chủ, đồng thời xác nhận còn số lượng phiên bản giới hạn.'],
        ['3. Hoàn tiền tự động sau thanh toán','Nếu thanh toán thành công nhưng suất giới hạn cuối cùng đã được cấp cho khách hàng khác trước trong giao dịch đồng thời, đơn hàng chuyển sang trạng thái chờ hoàn tiền. Khách hàng không bị yêu cầu thanh toán lại và quy trình hoàn tiền cho cùng giao dịch sẽ được bắt đầu.'],
        ['4. Thanh toán trùng và lỗi hệ thống','Nếu xác nhận có lỗi hệ thống hoặc thanh toán trùng rõ ràng, hồ sơ đơn hàng và thanh toán sẽ được kiểm tra và phần trùng được hoàn lại. Khách hàng không nên thanh toán lặp lại cùng một đơn; hãy kiểm tra trang trạng thái thanh toán hoặc liên hệ hỗ trợ trước.'],
        ['5. Sau khi nội dung số cá nhân hóa được phát hành','Guardian được cá nhân hóa theo tên, điều ước, lời nhắn và thông tin người mua nhập. Sau khi thanh toán được xác nhận bình thường và Guardian cá nhân hóa đã phát hành, hoàn tiền chỉ vì đổi ý có thể bị hạn chế. Nếu luật áp dụng, chính sách nhà cung cấp thanh toán hoặc quy định bảo vệ người tiêu dùng trao quyền mạnh hơn, quy định đó được ưu tiên.'],
        ['6. Lỗi phát hành','Nếu thanh toán hoàn tất bình thường nhưng Guardian không được phát hành do lỗi máy chủ, hoặc tệp/mã phát hành được cung cấp rõ ràng khác với đơn hàng, chúng tôi sẽ ưu tiên phát hành đúng hoặc sửa lỗi. Nếu không thể giải quyết hợp lý, điều kiện hoàn tiền sẽ được xem xét.'],
        ['7. Trạng thái hoàn tiền','Yêu cầu hoàn tiền hoặc hoàn tiền tự động được quản lý bằng các trạng thái pending / processing / refunded / failed. Thời điểm tiền thực sự được phản ánh có thể khác nhau tùy nhà cung cấp thanh toán, đơn vị phát hành thẻ hoặc ngân hàng.'],
        ['8. Không hài lòng với kết quả không phải lý do hoàn tiền','Guardian là nội dung số mang tính biểu tượng để động viên và không bảo đảm đỗ thi, việc làm, thăng chức, kết quả tài chính, hồi phục sức khỏe, cải thiện quan hệ hoặc bất kỳ kết quả tương lai nào khác. Chỉ riêng việc không đạt kết quả thực tế mong đợi không phải là lý do hoàn tiền.'],
        ['9. Hỗ trợ','Khi hỏi về hoàn tiền hoặc trạng thái thanh toán, hãy chuẩn bị mã đơn Guardian và thời gian thanh toán. Không gửi toàn bộ số thẻ, mật khẩu, mã bảo mật hoặc thông tin thanh toán nhạy cảm khác cho bộ phận hỗ trợ.']
      ],notice:'※ Chính sách này có thể được điều chỉnh thêm trước khi ra mắt chính thức để phù hợp với phê duyệt của nhà cung cấp thanh toán và pháp luật áp dụng tại các quốc gia thực tế bán hàng.'},
      privacy:{title:'Chính sách quyền riêng tư | Lumen Destiny',hero:'Chính sách quyền riêng tư',intro:'Lumen Destiny tuân theo nguyên tắc chỉ xử lý lượng thông tin tối thiểu cần thiết để cung cấp dịch vụ.',sections:[
        ['1. Dữ liệu Tứ trụ và hợp tuổi miễn phí','Các giá trị người dùng nhập như tên hoặc biệt danh, ngày sinh, giờ sinh, giới tính và loại lịch được dùng để tính và hiển thị kết quả. Dữ liệu Tứ trụ và hợp tuổi miễn phí ở V1 không được thiết kế với giả định lưu dài hạn trong cơ sở dữ liệu thành viên riêng.'],
        ['2. Đơn Guardian và xác minh','Trong quá trình chuẩn bị phát hành Guardian, hệ thống có thể xử lý thông tin cần thiết cho đơn hàng như tên hiển thị, hạng và nhóm điều ước đã chọn, trạng thái quà tặng và thông tin quà tặng cần thiết, mã đơn hàng, trạng thái thanh toán/phát hành. Màn hình xác minh công khai được thiết kế để không lưu hoặc hiển thị nội dung điều ước hay thông tin thanh toán nhạy cảm.'],
        ['3. Thông tin thanh toán','Không gửi toàn bộ số thẻ, mật khẩu, mã bảo mật hoặc thông tin thanh toán nhạy cảm khác cho hỗ trợ Lumen Destiny. Khi thanh toán được bật, thông tin thanh toán thực tế được xử lý trong môi trường thanh toán bảo mật của nhà cung cấp được kết nối.'],
        ['4. Ảnh khuôn mặt','Tải ảnh khuôn mặt không nằm trong phạm vi công khai của V1. Nếu tính năng xem tướng được phát hành sau này, sẽ có thông báo và quy trình đồng ý riêng trước khi tải lên. Ảnh gốc chỉ được xử lý trong thời gian tối thiểu cần cho phân tích rồi tự động xóa, không được lưu hay tái sử dụng trong tài khoản thành viên, màn hình quản trị, hồ sơ phân tích hoặc bản sao lưu.'],
        ['5. Yêu cầu của người dùng','Yêu cầu xóa, chỉnh sửa hoặc xử lý thông tin cá nhân được tiếp nhận qua email bên dưới. Chỉ thông tin tối thiểu cần thiết để xác minh yêu cầu được kiểm tra.']
      ],contact:'Liên hệ và yêu cầu về quyền riêng tư: llumendestiny@gmail.com',home:'Về trang chủ'},
      support:{title:'Hỗ trợ | Lumen Destiny',hero:'Hỗ trợ',intro:'Liên hệ về việc sử dụng dịch vụ, phát hành và xác minh Guardian, trạng thái thanh toán hoặc yêu cầu quyền riêng tư.',cards:[
        ['Sử dụng dịch vụ','Nếu có vấn đề với kết quả Tứ trụ, hợp tuổi, lựa chọn ngôn ngữ hoặc hiển thị màn hình, hãy cho biết thiết bị đã dùng và gửi ảnh chụp màn hình nếu có thể.'],
        ['Guardian','Khi hỏi về mã phát hành, xác minh, quà tặng, câu chuyện hoặc sự kiện Physical Guardian, hãy gửi kèm mã phát hành Guardian.'],
        ['Thanh toán và hoàn tiền','Sau khi thanh toán được bật, khi hỏi về thanh toán hoặc hoàn tiền hãy cung cấp mã đơn Guardian và thời gian thanh toán. Không gửi toàn bộ số thẻ, mật khẩu, mã bảo mật hoặc thông tin thanh toán nhạy cảm khác.'],
        ['Quyền riêng tư','Yêu cầu xóa, chỉnh sửa và xử lý được tiếp nhận qua email liên hệ; chỉ thông tin tối thiểu cần để xác minh yêu cầu được kiểm tra.'],
        ['Email liên hệ','<strong>llumendestiny@gmail.com</strong>']
      ],notice:'※ Phạm vi công khai V1 là Tứ trụ miễn phí, vận mệnh, hợp tuổi và Guardian. Tư vấn 1:1 hiện không công khai.',footer:['Chính sách quyền riêng tư','Điều khoản sử dụng','Hoàn tiền & Hủy','Guardian']}
    },
    zh:{
      terms:{title:'使用条款 | Lumen Destiny',hero:'使用条款',intro:'本页面说明 Lumen Destiny 的服务使用条件和数字内容使用原则。',sections:[
        ['服务性质','四柱、合婚与运势解读属于基于传统文化的参考内容，不保证未来、考试、财务、健康或关系等任何特定结果。'],
        ['免费解读与付费内容','基础四柱和运势解读原则上免费提供。Guardian 等可选数字内容可以作为单独购买项目提供。'],
        ['付款与退款','Guardian 是为购买者个性化后发行的数字内容。付款前取消、付款确认后发行、售罄、重复付款、系统错误以及个性化发行后的退款限制等详细规则，以公开的<a href="/refund-policy.html">退款与取消政策</a>为准。如果适用法律或支付服务商政策赋予消费者更强的权利，则以该规定为优先。'],
        ['故事与活动','成功故事仅在获得客户另行同意后公开。我们不会将 Guardian 描述为结果产生的原因。Physical Guardian 活动的筛选标准和数量以各活动公告为准。'],
        ['服务变更','正式上线前，功能、价格和支付结构可能发生变化。商业化上线前将以实际运营结构为基础最终确定条款。']
      ]},
      refund:{title:'退款与取消政策 | Lumen Destiny',hero:'退款与取消政策',intro:'Guardian 是下单后进行个性化并发行的数字内容。以下标准公开供客户在付款前确认。',sections:[
        ['1. 付款前取消','付款完成前可随时停止付款。关闭或取消付款页面时，Guardian 不会发行。'],
        ['2. 付款确认与发行时点','仅浏览器显示付款成功并不会发行 Guardian。只有在支付服务商的服务器确认（Webhook）完成、订单金额、币种和订单编号与服务器记录一致，并确认该限量版本仍有可发行数量后，Guardian 才会发行。'],
        ['3. 付款后的自动退款','如果付款成功，但在并发购买中最后一个限量名额已先分配给其他客户而无法发行，订单将转为等待退款状态。不会要求客户再次付款，并会针对同一笔付款启动退款流程。'],
        ['4. 重复付款与系统错误','如果确认存在系统错误或明显的重复付款，将审核订单和付款记录，并对重复部分进行退款。客户不应对同一订单反复付款，应先在付款状态页面或客户支持确认状态。'],
        ['5. 个性化数字内容发行后','Guardian 会根据购买者输入的姓名、愿望、留言等进行个性化发行。在正常确认付款并发行个性化 Guardian 后，仅因改变主意申请退款可能受到限制。但如果适用法律、支付服务商政策或消费者保护规定赋予更强权利，则该规定优先。'],
        ['6. 发行错误','如果付款正常完成但因服务器错误未发行 Guardian，或提供的文件、发行编号与订单明显不符，将优先进行正确发行或更正；如果无法在合理范围内解决，将审核是否符合退款条件。'],
        ['7. 退款处理状态','退款申请或自动退款创建后，将以 pending / processing / refunded / failed 状态管理。实际退款到账时间可能因支付服务商、发卡机构或银行而异。'],
        ['8. 对结果不满意不是退款理由','Guardian 是象征性的数字鼓励内容，不保证考试合格、就业、晋升、财务成果、健康恢复、关系改善或任何其他未来结果。仅因为没有出现预期的现实结果，不构成退款理由。'],
        ['9. 客户支持','咨询退款或付款状态时，请准备 Guardian 订单编号和付款时间。请勿向客户支持发送完整卡号、密码、安全码或其他敏感支付信息。']
      ],notice:'※ 本政策可能在正式上线前根据支付服务商批准情况以及实际销售国家的适用法律进一步调整。'},
      privacy:{title:'隐私政策 | Lumen Destiny',hero:'隐私政策',intro:'Lumen Destiny 坚持仅处理提供服务所必需的最少信息。',sections:[
        ['1. 免费四柱与合婚输入','用户输入的姓名或昵称、出生日期、出生时间、性别、历法类型等信息用于计算和显示结果。当前 V1 免费四柱与合婚输入并非以长期存储在单独会员数据库为前提设计。'],
        ['2. Guardian 订单与验证','在 Guardian 发行准备过程中，可能处理订单所需的信息，包括显示名称、所选等级与愿望类别、是否为礼物及必要的礼物信息、订单标识符、付款和发行状态等。公开验证页面采用不存储、不展示愿望正文或敏感支付信息的结构。'],
        ['3. 支付信息','请勿向 Lumen Destiny 客户支持发送完整卡号、密码、安全码或其他敏感支付信息。启用付款后，实际支付信息由所连接支付服务商的安全支付环境处理。'],
        ['4. 人脸照片','V1 公开范围不包含面相照片上传功能。未来若公开面相功能，将在上传前提供单独告知和同意流程，原始照片仅在分析所需的最短时间内处理，随后自动删除，并不会在会员账户、管理后台、分析记录或备份中保存或再次使用原始照片。'],
        ['5. 用户请求','有关个人信息删除、更正或处理的请求通过下方电子邮箱受理。仅核实确认请求所必需的最少信息。']
      ],contact:'咨询与隐私请求: llumendestiny@gmail.com',home:'返回首页'},
      support:{title:'客户支持 | Lumen Destiny',hero:'客户支持',intro:'可就服务使用、Guardian 发行与验证、付款状态或隐私请求联系我们。',cards:[
        ['服务使用','如果四柱结果、合婚、语言选择或页面显示出现问题，请说明所使用的设备，并尽可能附上截图。'],
        ['Guardian','咨询发行编号、验证、礼物、故事或 Physical Guardian 活动时，请同时提供 Guardian 发行编号。'],
        ['付款与退款','付款功能启用后，咨询付款或退款时请提供 Guardian 订单编号和付款时间。请勿发送完整卡号、密码、安全码或其他敏感支付信息。'],
        ['隐私','删除、更正及处理请求通过联系邮箱受理，仅核实确认请求所需的最少信息。'],
        ['联系邮箱','<strong>llumendestiny@gmail.com</strong>']
      ],notice:'※ V1 公开范围为免费四柱、运势、合婚和 Guardian，1:1 咨询功能目前不公开。',footer:['隐私政策','使用条款','退款与取消','Guardian']}
    }
  };

  const P=pages[lang];
  if(!P)return;
  const q=s=>document.querySelector(s);
  const sectionHtml=items=>items.map(([h,p])=>`<h2>${h}</h2><p>${p}</p>`).join('');
  const privacyHtml=items=>items.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join('');

  if(path==='/terms'){
    const d=P.terms;if(!d)return;
    document.title=d.title;
    const hero=q('.result-hero');
    if(hero){hero.querySelector('h1').textContent=d.hero;hero.querySelector('p:last-child').textContent=d.intro;}
    const panel=q('.result-panel');if(panel)panel.innerHTML=sectionHtml(d.sections);
  }else if(path==='/refund-policy'){
    const d=P.refund;if(!d)return;
    document.title=d.title;
    const hero=q('.result-hero');
    if(hero){hero.querySelector('h1').textContent=d.hero;hero.querySelector('p:last-child').textContent=d.intro;}
    const panel=q('.result-panel');if(panel)panel.innerHTML=sectionHtml(d.sections)+`<p class="result-disclaimer">${d.notice}</p>`;
  }else if(path==='/privacy'){
    const d=P.privacy;if(!d)return;
    document.title=d.title;
    const main=q('main');if(main){
      const label=main.querySelector('.section-label');
      main.innerHTML='';
      if(label)main.appendChild(label);
      const h=document.createElement('h2');h.textContent=d.hero;main.appendChild(h);
      const intro=document.createElement('p');intro.textContent=d.intro;main.appendChild(intro);
      const body=document.createElement('div');body.innerHTML=privacyHtml(d.sections)+`<p><strong>${d.contact}</strong></p><p><a class="button secondary" href="/?lang=${encodeURIComponent(lang)}">${d.home}</a></p>`;main.appendChild(body);
    }
  }else if(path==='/support'){
    const d=P.support;if(!d)return;
    document.title=d.title;
    const hero=q('.result-hero');
    if(hero){hero.querySelector('h1').textContent=d.hero;hero.querySelector('p:last-child').textContent=d.intro;}
    const grid=q('.deep-reading-grid');
    if(grid)grid.innerHTML=d.cards.map(([h,p])=>`<article><span>${h}</span><p>${p}</p></article>`).join('');
    const notice=q('.result-panel>.result-disclaimer');if(notice)notice.textContent=d.notice;
    const footer=[...document.querySelectorAll('.footer-links a')];d.footer.forEach((t,i)=>{if(footer[i])footer[i].textContent=t});
  }

  // Preserve the selected language on internal policy links created by translated HTML.
  document.querySelectorAll('a[href]').forEach(a=>{
    try{
      const raw=a.getAttribute('href');
      if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('http'))return;
      const u=new URL(raw,location.origin);
      if(u.origin!==location.origin)return;
      u.searchParams.set('lang',lang);
      a.setAttribute('href',u.pathname+u.search+u.hash);
    }catch{}
  });
})();
