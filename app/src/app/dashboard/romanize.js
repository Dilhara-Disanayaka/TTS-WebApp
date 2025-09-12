
var text;
var nVowels;
var consonants= new Array();
var consonantsUni= new Array();
//var consonants1= new Array();
//var consonantsUni1= new Array();
var vowels= new Array();
var vowelsUni= new Array();
var vowelModifiersUni= new Array();
var specialConsonants= new Array();
var specialConsonantsUni= new Array();
var specialCharUni= new Array();
var specialChar= new Array();


    vowelsUni[0]='ඌ';    vowels[0]='ū';    vowelModifiersUni[0]='ූ';
    vowelsUni[1]='ඕ';    vowels[1]='ō';    vowelModifiersUni[1]='ෝ';    
    vowelsUni[2]='ආ';    vowels[2]='ā';    vowelModifiersUni[2]='ා'; //  
    vowelsUni[3]='ඈ';    vowels[3]='ǣ';    vowelModifiersUni[3]='ෑ';    
    vowelsUni[4]='ඊ';    vowels[4]='ī';    vowelModifiersUni[4]='ී';    
    vowelsUni[5]='ඒ';    vowels[5]='ē';    vowelModifiersUni[5]='ේ';    
    vowelsUni[6]='ඖ';    vowels[6]='au';    vowelModifiersUni[6]='ෞ';
    vowelsUni[7]='ඇ';    vowels[7]='æ';    vowelModifiersUni[7]='ැ';
    
    vowelsUni[8]='ඉ';    vowels[8]='i';    vowelModifiersUni[8]='ි'; 
    vowelsUni[9]='උ';    vowels[9]='u';    vowelModifiersUni[9]='ු';
    vowelsUni[10]='අ';    vowels[10]='a';    vowelModifiersUni[10]=''; 
    vowelsUni[11]='එ';    vowels[11]='e';    vowelModifiersUni[11]='ෙ';
    
    vowelsUni[12]='ෛ';    vowels[12]='‍ĩ';    vowelModifiersUni[12]='‍ෛ';
    
    vowelsUni[13]='ඔ';    vowels[13]='o';    vowelModifiersUni[13]='ො';
    vowelsUni[14]='ඓ';    vowels[14]='ai';    vowelModifiersUni[14]='‍‍ෛ';
    vowelsUni[15]='්';     vowels[15]='' ;  vowelModifiersUni[15]='්';    
   // vowelsUni[16]='ඪ';    vowels[16]='ḍha';     
      
  
        
    nVowels=17 ;
	
	
   
    
    
    specialConsonantsUni[0]='ං'; specialConsonants[0]='ṅ';//
    specialConsonantsUni[1]='ඃ'; specialConsonants[1]= 'ḥ';//
    specialConsonantsUni[2]='ඞ'; specialConsonants[2]='ṁ';//
    specialConsonantsUni[3]='ඍ'; specialConsonants[3]= 'ṛ';//
    specialConsonantsUni[4]='ඎ'; specialConsonants[4]='ṝ';//
    specialConsonantsUni[5]='ඏ'; specialConsonants[5]='ḷ';//
    specialConsonantsUni[6]='ඐ'; specialConsonants[6]='ḹ';// 
   // specialConsonantsUni[8]='්'; specialConsonants[8]=/ȧ/g; // Hal
    //special characher Repaya
    //specialConsonantsUni[7]='ර්'+'\u200D'; specialConsonants[4]=/R/g;//imp
    specialConsonantsUni[7]='ර්'+'\u200D'; specialConsonants[7]=/\\r/g;//imp//
    //specialConsonantsUni[8]='ඦ'; specialConsonants[8]=/n̆j/g;//
    
 

    consonantsUni[0]='ඬ'; consonants[0]='n̆ḍ';
    consonantsUni[1]='ඳ'; consonants[1]='n̆d';//
    consonantsUni[2]='ඟ'; consonants[2]='n̆g';//
    consonantsUni[3]='ථ'; consonants[3]='th';//
    consonantsUni[4]='ධ'; consonants[4]='dh';//
    consonantsUni[5]='ඝ'; consonants[5]='gh';//
    consonantsUni[6]='ඡ'; consonants[6]='chh';//
    consonantsUni[7]='ඵ'; consonants[7]='ph';//
    consonantsUni[8]='භ'; consonants[8]='bh';//
    consonantsUni[9]='ශ'; consonants[9]='ś';//
    consonantsUni[10]='ෂ'; consonants[10]='sh';//
    consonantsUni[11]='ඥ'; consonants[11]='gn';//
    consonantsUni[12]='ඤ'; consonants[12]='ñ';//
    //consonantsUni[13]='ළු'; consonants[13]='lụ';//
    consonantsUni[13]='ද'; consonants[13]='d';//
    consonantsUni[14]='ච'; consonants[14]='ch';//
    consonantsUni[15]='ඛ'; consonants[15]='kh';//
    consonantsUni[16]='ත'; consonants[16]='t';//
    
    consonantsUni[17]='ට'; consonants[17]='ṭ';//
    consonantsUni[18]='ක'; consonants[18]='k';//   
    consonantsUni[19]='ඩ'; consonants[19]='ḍ';//
    consonantsUni[20]='න'; consonants[20]='n';//
    consonantsUni[21]='ප'; consonants[21]='p';//
    consonantsUni[22]='බ'; consonants[22]='b';//
    consonantsUni[23]='ම'; consonants[23]='m';//
    //consonantsUni[25]='‍ය'; consonants[25]='\\u005C' + 'y';
    //consonantsUni[26]='‍ය'; consonants[26]='Y';
    consonantsUni[24]='ය'; consonants[24]='y';//
    consonantsUni[25]='ජ'; consonants[25]='j';//
    consonantsUni[26]='ල'; consonants[26]='l';//
    consonantsUni[27]='ව'; consonants[27]='v';//
    //consonantsUni[29]='ව'; consonants[29]='w';
    consonantsUni[28]='ස'; consonants[28]='s';//
    consonantsUni[29]='හ'; consonants[29]='h';//
    consonantsUni[30]='ණ'; consonants[30]='ṇ';//
    consonantsUni[31]='ළ'; consonants[31]='ḷ';
    //consonantsUni[34]='ඛ'; consonants[34]='K';
    //consonantsUni[35]='ඝ'; consonants[35]='G';
    consonantsUni[32]='ඨ'; consonants[32]='ṯ';//
    consonantsUni[33]='ඪ'; consonants[33]='ḏ';
    //consonantsUni[38]='ඵ'; consonants[38]='P';
    consonantsUni[34]='ඹ'; consonants[34]='ḅ';
    consonantsUni[35]='ෆ'; consonants[35]='f';
    consonantsUni[36]='ඣ'; consonants[36]='q';//
    consonantsUni[37]='ග'; consonants[37]='g';//    
    consonantsUni[38]='ළු'; consonants[38]='ḷu';//    
    //last because we need to ommit this in dean̆ling with Rakaransha
    consonantsUni[39]='ර'; consonants[39]='r';//
    consonantsUni[40]='ඦ'; consonants[40]='n̆ǰ';

    //Hal
    //consonantsUni[41]='්'; consonants[41]='ȧ';
    
    //consonantsUni1[0]= 'න් '; consonants1[0]='n';//
    

    specialCharUni[0]='ෲ'; specialChar[0]='ruu';//
    specialCharUni[1]='ෘ'; specialChar[1]='ru';//
    //specialCharUni[2]='්‍ර'; specialChar[2]='ra';
function sinroamTranslator(valNum) {
  //valNum = parseFloat(valNum);
  //document.getElementById("outputCelcius").innerHTML=(valNum-32)/1.8;
  ///document.getElementById("outputCelcius").innerHTML=normalize(valNum);
 // document.getElementById("outputName").innerHTML=valNum.strip(); 
 //document.getElementById("outputName").innerHTML=convert_accented_characters(valNum);  
 document.getElementById("outputName2").innerHTML=startText(valNum);  
};
function sinroamTranslatorS(valNum) {
  //valNum = parseFloat(valNum);
  //document.getElementById("outputCelcius").innerHTML=(valNum-32)/1.8;
  ///document.getElementById("outputCelcius").innerHTML=normalize(valNum);
 // document.getElementById("outputName").innerHTML=valNum.strip(); 
 //document.getElementById("outputName").innerHTML=convert_accented_characters(valNum);  
 document.getElementById("outputName1").innerHTML=startTextS(valNum);  
};
//Roman to Sinhala Translation
function startText(text) {
    var s,r,v;
    
    ///text = document.txtBox.box1.value;  
    //special consonents
    for (var i=0; i<specialConsonants.length; i++){
        s=specialConsonants[i];
        v=specialConsonantsUni[i];
        r = new RegExp(s, "g");
        text = text.replace(r, v);
        //text = text.replace(specialConsonants[i], specialConsonantsUni[i]);
    }
   
     //consonents + special Chars
    for (var i=0; i<specialCharUni.length; i++){
        for (var j=0;j<consonants.length;j++){
            s = consonants[j] + specialChar[i];
            v = consonantsUni[j] + specialCharUni[i];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
    }
    
    //consonants + Rakaransha + vowel modifiers
    for (var j=0;j<consonants.length;j++){
        for (var i=0;i<vowels.length;i++){
            s = consonants[j] + "r" + vowels[i];
            v = consonantsUni[j] + "්‍ර" + vowelModifiersUni[i];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
        s = consonants[j] + "r";
        v = consonantsUni[j] + "්‍ර";
        r = new RegExp(s, "g");
        text = text.replace(r, v);
    }
    
    //consonents + vowel modifiers
    for (var i=0;i<consonants.length;i++){
        for (var j=0;j<15;j++){ 
            s = consonants[i]+vowels[j];
            v = consonantsUni[i] + vowelModifiersUni[j];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
    }

    //consonents + HAL
    for (var i=0; i<consonants.length; i++){
        r = new RegExp(consonants[i], "g");
        text = text.replace(r, consonantsUni[i]+"්");
    }
    
    //ai akura
    
        for (var i=0; i<consonants.length; i++){
        r = new RegExp(vowels[14], "g");
        text = text.replace(r, vowelsUni[14]='ඓ');
    }
    
//    //dha akura
//    
//        for (var i=0; i<consonants.length; i++){
//        r = new RegExp(vowels[16], "g");
//        text = text.replace(r, vowelsUni[16]='ඪ');
//    }
    
    //vowels
    
    for (var i=0; i<vowels.length; i++){
        for (var j=0;j<14;j++){
        r = new RegExp(vowels[j], "g");
        text = text.replace(r, vowelsUni[j]) }}

    ///document.txtBox.box2.value=text;
    return text;
}





// Sinhala to Roman Translation
function startTextS(text) {
    var s,r,v;
    ///text = document.txtBox.box1.value;  
    //
//special consonents
    for (var i=0; i<specialConsonantsUni.length; i++){
        v=specialConsonants[i];
        s=specialConsonantsUni[i];
        r = new RegExp(s, "g");
        text = text.replace(r,v);
        //text = text.replace(specialConsonants[i], specialConsonantsUni[i]);
    }
    
        //consonents + special Chars
    for (var i=0; i<specialChar.length; i++){
        for (var j=0;j<consonantsUni.length;j++){
            v = consonants[j] + specialChar[i];
            s = consonantsUni[j] + specialCharUni[i];
            r = new RegExp(s, "g");
            text = text.replace(r,v);
        }
            v = consonants[j] + specialChar[i] + specialChar[i];
            s = consonantsUni[j] + specialCharUni[i] + specialCharUni[i];
            r = new RegExp(s, "g");
            text = text.replace(r,v);
    }
   
        //consonants + Rakaransha + vowel modifiers
    for (var j=0;j<consonantsUni.length;j++){
        for (var i=0;i<vowels.length;i++){
            v = consonants[j] + "r" + vowels[i];
            s = consonantsUni[j] + "්‍ර" + vowelModifiersUni[i];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
        v = consonants[j] + "r";
        s = consonantsUni[j] + "්‍ර";
        r = new RegExp(s, "g");
        text = text.replace(r, v);
    }
    
    //consonents + vowel modifiers
    
 for (var i=0;i<consonantsUni.length;i++){
        for (var j=11; j<16; j++){ 
            v = consonants[i]+vowels[j];
            s = consonantsUni[i] + vowelModifiersUni[j];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
            //errors with constents + i,e,u,o,ai
        }
    }
        
   //for (var i=0;i<consonantsUni.length;i++){     
        
    
    for (var i=0;i<consonantsUni.length;i++){
        for (var j=0;j<10;j++){ 
            v = consonants[i]+vowels[j];
            s = consonantsUni[i] + vowelModifiersUni[j];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
    }
    // 'a' yanna
  for (var i=0;i<consonantsUni.length;i++){
                   
            v = consonants[i]+'a';
            s = consonantsUni[i] + '';
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
      //consonents + HAL  
//  for (var i=0;i<consonantsUni.length;i++){      
//                 
//        v = consonants[i] ;
//        s = consonantsUni[i] +   ' ් ' ;;
//        r = new RegExp(s, "g");
//        text = text.replace(r, v);
//  }   
        
        
//   for (var i=0; i<consonants.length; i++){
//       r = new RegExp(consonantsUni[i]+'්');
//      text = text.replace(r,consonants[i],"g");
//   }
////     
   
        
        
    // o yanna
     for (var i=0;i<consonantsUni.length;i++){
       
            v = consonants[i]+'o';
            s = consonantsUni[i] + 'ො';
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }

    //vowels
    for (var i=0; i<vowelsUni.length; i++){
       for (var j=0;j<15;j++){
        r = new RegExp(vowelsUni[j], "g");
        text = text.replace(r, vowels[j]);
    }}

    ///document.txtBox.box2.value=text;
    return text;
}
//
function makeSortString(s) {
  if(!makeSortString.translate_re) makeSortString.translate_re = /[öäüÖÄÜ]/g;
  var translate = {
    "ä": "a", "ö": "o", "ü": "u",
    "Ä": "A", "Ö": "O", "Ü": "U"   // probably more to come
  };
  return ( s.replace(makeSortString.translate_re, function(match) { 
    return translate[match]; 
  }) );
};
var normalize = (function () {
    var a = ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ', 'ĳ', 'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ', 'œ', 'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ', 'ǽ', 'Ǿ', 'ǿ'];
    var b = ['A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o'];

    return function (str) {
        var i = a.length;
        while (i--) str = str.replace(a[i], b[i]);
        return str;
};
}());

String.prototype.strip = function() {
  var translate_re = /[öäüÖÄÜßඅආඇඈඉඊඋඌඍඎඏඐඑදීඔබ]/g;
  var translate = {
    "ä":"a", "ö":"o", "ü":"u", "අ":"a", "ආ":"aa","ඇ":"æ","ඈ":"ǣ","ඉ":"i","ඊ":"ī","උ":"u","ඌ":"ū","ඍ":"ṛ","ඎ":"ṝ","ඏ":"ḷ","ඐ":"ḹ","එ":"e",
    "Ä":"A", "Ö":"O", "Ü":"U",
    " ":"_", "ß":"ss","බ":"b"   // probably more to come
  };
    return (this.replace(translate_re, function(match){
        return translate[match];})
    );
};
function convert_accented_characters(str){
    var conversions = new Object();
    conversions['a'] = 'අ‍';
    conversions['ā'] = 'ආ';
    conversions['æ'] = 'ඇ';
    conversions['ǣ'] = 'ඈ';
    conversions['b'] = 'බ';    
    //conversions['ba'] = 'බ';
    //conversions['b'] = 'බ්';    
    //conversions['d'] = 'ද්';
    conversions['d'] = 'ද';
    //conversions['de'] = 'දෙ|දේ';
    conversions['i'] = 'ි|ඉ'; 
    conversions['ī'] = 'ඊ|ී';
    conversions['e'] = 'ෙ';
	conversions['o'] = 'ො';
    conversions['e'] = 'එ';
    conversions['ē'] = 'ඒ';
    conversions['‍ai'] = 'ඓ';
    //conversions['i'] = 'ඉ';
    
    conversions['Oe'] = 'Ö';
    //conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
    //conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
    conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
    conversions['c'] = 'ç|ć|ĉ|ċ|č';
    //conversions['D'] = 'Ð|Ď|Đ';
    //conversions['d'] = 'ð|ď|đ';
    conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
    //conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
    conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
    conversions['g'] = 'ĝ|ğ|ġ|ģ';
    conversions['H'] = 'Ĥ|Ħ';
    conversions['h'] = 'ĥ|ħ';
    //conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
    //conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
    conversions['J'] = 'Ĵ';
    conversions['j'] = 'ĵ';
    conversions['K'] = 'Ķ';
    conversions['k'] = 'ķ';
    conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
    conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
    //conversions['N'] = 'Ñ|Ń|Ņ|Ň';
    //conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
    conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
    conversions['o'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
    //conversions['R'] = 'Ŕ|Ŗ|Ř';
    conversions['r'] = 'ර';
    conversions['S'] = 'Ś|Ŝ|Ş|Š';
    conversions['s'] = 'ś|ŝ|ş|š|ſ';
    conversions['T'] = 'Ţ|Ť|Ŧ';
    conversions['t'] = 'ţ|ť|ŧ';
    //conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
   conversions['u'] = 'උ|ැ';
    conversions['Y'] = 'Ý|Ÿ|Ŷ';
    conversions['y'] = 'ý|ÿ|ŷ';
    conversions['W'] = 'Ŵ';
    conversions['w'] = 'ŵ';
    conversions['Z'] = 'Ź|Ż|Ž';
    conversions['z'] = 'ź|ż|ž';
    conversions['AE'] = 'Æ|Ǽ';
    conversions['ss'] = 'ß';
    conversions['IJ'] = 'Ĳ';
    conversions['ij'] = 'ĳ';
    conversions['OE'] = 'Œ';
   // conversions['f'] = 'ƒ';
    for(var i in conversions){
        var re = new RegExp(conversions[i],"g");
        str = str.replace(re,i);
    }
    return str;
}

export { startTextS, startText, sinroamTranslatorS, sinroamTranslator };
