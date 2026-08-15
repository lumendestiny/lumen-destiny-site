import QRCode from 'react-native-qrcode-svg';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { GuardianProduct } from '../lib/guardian-products';

const VERIFY_BASE='https://lumendestiny.com/guardian-verify/';

export function guardianVerifyUrl(id:string){
 const u=new URL(VERIFY_BASE);u.searchParams.set('id',id);return u.toString();
}

function serialText(serial:string|number|null|undefined,limit:number,status?:string){
 if(serial===null||serial===undefined||serial==='')return status==='verified'?`발행번호 확인 중 / ${limit}`:`발급 대기 / ${limit}`;
 const s=String(serial).trim();return s.includes('/')?s:`${s}/${limit}`;
}

export default function GuardianCertificateCard({product,id,displayName,serial,editionLimit,status='pending',issuedAt}:{product:GuardianProduct;id:string;displayName:string;serial?:string|number|null;editionLimit:number;status?:string;issuedAt?:string|null}){
 const verified=status==='verified',url=guardianVerifyUrl(id);
 return <View style={[s.frame,verified&&s.verified]}>
  <Image source={{uri:product.image}} style={s.art} resizeMode="cover" />
  <View style={s.overlay} />
  <View style={s.top}><Text style={s.brand}>LUMEN GUARDIAN</Text><Text style={s.badge}>{verified?'VERIFIED':'ISSUANCE PREVIEW'}</Text></View>
  <View style={s.bottom}>
   <View style={s.copy}><Text style={s.name}>{displayName||product.name}</Text><Text style={s.meta}>{product.element} · {product.wish}</Text><Text style={s.serial}>NO. {serialText(serial,editionLimit,status)}</Text><Text style={s.id}>{id}</Text>{issuedAt?<Text style={s.date}>ISSUED {new Date(issuedAt).toLocaleDateString()}</Text>:null}</View>
   <View style={s.qrWrap}><QRCode value={url} size={76} backgroundColor="#ffffff" color="#111111" /><Text style={s.qrText}>VERIFY</Text></View>
  </View>
 </View>
}

const s=StyleSheet.create({frame:{width:'100%',aspectRatio:941/1672,borderRadius:20,overflow:'hidden',backgroundColor:'#111',borderWidth:1,borderColor:'#d8dbe3'},verified:{borderWidth:2,borderColor:'#b88a31'},art:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.24)'},top:{position:'absolute',left:16,right:16,top:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},brand:{fontSize:12,fontWeight:'900',letterSpacing:1.5,color:'#fff'},badge:{fontSize:9,fontWeight:'900',letterSpacing:1,color:'#fff',paddingHorizontal:8,paddingVertical:5,borderRadius:999,backgroundColor:'rgba(0,0,0,.45)'},bottom:{position:'absolute',left:14,right:14,bottom:14,padding:12,borderRadius:16,backgroundColor:'rgba(255,255,255,.94)',flexDirection:'row',gap:10,alignItems:'flex-end'},copy:{flex:1},name:{fontSize:20,fontWeight:'900',color:'#242637'},meta:{fontSize:11,lineHeight:17,color:'#5d6370',marginTop:3},serial:{fontSize:12,fontWeight:'900',color:'#8b651b',marginTop:7},id:{fontSize:9,color:'#777d89',marginTop:3},date:{fontSize:9,fontWeight:'800',color:'#626876',marginTop:3},qrWrap:{padding:6,borderRadius:10,backgroundColor:'#fff',alignItems:'center'},qrText:{fontSize:8,fontWeight:'900',letterSpacing:.8,color:'#363946',marginTop:4}});
