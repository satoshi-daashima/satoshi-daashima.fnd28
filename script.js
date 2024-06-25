//入力される前に宣言できるもののみ
const arrayOfIdName = ["accountingDate", "paymentDate", "effectiveDate", "startDate", "endDate"];
const effDate = document.getElementById("effectiveDate");
const staDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");


//　納品形式ごとに入力不要箇所をグレーアウトする
function changeColors(){
  const deriverValue = document.getElementById("typeOfDeriver").value;
  if(deriverValue === "2"){
    effDate.value = "";
    effDate.style.backgroundColor = "gray";
    staDate.style.backgroundColor = "";
    endDate.style.backgroundColor = "";
  } else if(deriverValue === "1") {
    staDate.value = "";
    endDate.value = "";
    effDate.style.backgroundColor = "";
    staDate.style.backgroundColor = "gray";
    endDate.style.backgroundColor = "gray";
  } else {
    effDate.value = "";
    staDate.value = "";
    endDate.value = "";
    effDate.style.backgroundColor = "";
    staDate.style.backgroundColor = "";
    endDate.style.backgroundColor = "";
  }
 }

const typeOfDer = document.getElementById("typeOfDeriver");
typeOfDer.addEventListener("change", changeColors);


// 「判定開始」ボタン押下後の計算
function calculation(){

   // 入力値（日付）を取得し、オブジェクトに格納
  const makeDatesObject = () => {
    const datesObject = {};
    for (const idName of arrayOfIdName){
      const values = [];
      const valueOfIdName = document.getElementById(idName).value;
      const key = idName.slice(0, 3);
      values.push(Number(valueOfIdName.slice(0, 4)));
      values.push(Number(valueOfIdName.slice(5, 7)));
      values.push(Number(valueOfIdName.slice(8)));
      datesObject[key] = values;
    }
      return datesObject;
  }

  // 各日付のターム（期）を計算する準備
  const dates = makeDatesObject();
  console.log(dates);//正しく計算されているか見るために残す
  
  // 各日付のターム（期）を計算し、オブジェクトに格納
  const makeTermsOfject = () => {
    const termsObject = {};
    for (key in dates){
      if(dates[key][1] < 4){
        termsObject[key] = (dates[key][0] - 1904) + "期 後半期";
      } else if(dates[key][1] < 10) {
        termsObject[key] = (dates[key][0] - 1903) + "期 前半期";
      } else {
        termsObject[key] = (dates[key][0] - 1903) + "期 後半期";
      }
    }
      return termsObject;
  }

  //判定の準備
  const terms = makeTermsOfject();
  console.log(terms);//正しく計算されているか見るために残す
  const accDateInner = document.getElementById("accountingDate").value
  const effDateInner = document.getElementById("effectiveDate").value
  const endDateInner = document.getElementById("endDate").value
  const typeOfDeriver = document.getElementById("typeOfDeriver").value;
  const continuation = document.getElementById("continuation").checked;

  // 判定する
  const judgement = () => {
    if(terms.acc === terms.eff || terms.acc === terms.end){  //計上日と効果発生が同じ期
      if(accDateInner === effDateInner ||  accDateInner === endDateInner){  //計上日と効果発生日が同じ
        return "税務種別：通常 で起票してください"
      } else { //期は同じだけど、計上日と効果発生日が異なる 
        return "税務種別：通常、当期中の前払いを選択し、起票してください\n\nただし、継続納品 かつ 保全費（管理番号あり）の場合は、\n税務種別：固定資産 で起票してください"
      }
    } else if(typeOfDeriver === "2") { //期は異なる、納品形式が2とき
        if ((((dates.end[0]*12) + dates.end[1]) - ((dates.sta[0]*12) + dates.sta[1])) <= 12 //()の数はこれじゃないと正しく計算してくれない
           && continuation === true && terms.acc === terms.pay){ //開始日と終了日が365日以内 かつ 継続的 かつ 計上日と支払日が同じ期
            return "税務種別：通常、短期前払費用を選択して起票してください\n\nただし、保全費（管理番号あり）の場合は、\n税務種別：固定資産 で起票してください"
        } 
    }
      return "税務種別：前払費用 で起票してください"
  }

  window.alert(judgement());  

}

// 「判定開始」ボタンで計算を開始する
const calculate = document.getElementById("calculate");
calculate.addEventListener("click", calculation);


// 「クリア」ボタンでページを更新する
function reloadPage(){
  window.location.reload();
}

const reload = document.getElementById("reload");
reload.addEventListener("click", reloadPage);
