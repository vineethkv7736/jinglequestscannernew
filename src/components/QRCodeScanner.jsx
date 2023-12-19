import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../firebase/config.js";
import { doc, updateDoc } from "firebase/firestore";

const QRCodeScanner = (em) => {
  const [scanCount, setScanCount] = useState(0);
  const [test, testCount] = useState(0);
  const [check,setCheck] = useState(false);

  useEffect(() => {
    const storedScanCountJson = localStorage.getItem("scanCount");
    const storedScanCount = parseInt(JSON.parse(storedScanCountJson), 10);
    console.log(">>>",storedScanCount);
    if (storedScanCount !== null) {
      em.updateScanCount(storedScanCount);
    }
    //testCount(prev=>prev+1);
  }, []);

  const upcount = async (email) => {
    const up = doc(db, "users", email);
    await updateDoc(up, {
      qr: true,
    })
      .then(() => {
        console.log("Successful");
      })
      .catch((error) => {
        alert("Firebase error. Try again");
        console.error(error);
      });
    alert("Game ended");
  };

  useEffect(() => {

    const qrCodeScanner = new Html5QrcodeScanner("reader", {
      fps: 500,
      qrbox: 150,
    });

    qrCodeScanner.render(success, error);

    function success(result) {
      const l = result.length;
      result = result.toLowerCase();

      if (result.charAt(l - 1) === " " && result.substring(0, 3) === "prc") {
        const scannedCodes =
          JSON.parse(localStorage.getItem("scannedCodes")) || [];

        if (scannedCodes.includes(result)) {
          qrCodeScanner.clear();
          testCount((prevCount) => prevCount + 1);
          window.alert(`This QR code has already been scanned.`);
        } else {
          testCount((prevCount) => prevCount + 1);
          localStorage.setItem(
            "scannedCodes",
            JSON.stringify([...scannedCodes, result])
          );
          qrCodeScanner.clear();
          if (scanCount === 3) {
            upcount(em.email);
          }
          setScanCount((prev) => prev + 1);
        }
      } else {
        qrCodeScanner.clear();
        testCount((prevCount) => prevCount + 1);
        window.alert(`This QR is not authorized in our system`);
      }
      qrCodeScanner.clear();
    }

    function error() {}
  }, [test]);

  useEffect(() => {
    if(check){
      localStorage.setItem("scanCount", JSON.stringify(scanCount));
      em.updateScanCount(scanCount);
      console.log("Scancount:", scanCount);
    }
  }, [scanCount]);
  
  useEffect(()=>{
    if(!check){
      setCheck(true)
    }
  },[scanCount])

  return (
    <div>
      <div
        id="reader"
        className="p-4 ml-10 mr-10 bg-white flex flex-col justify-center shadow-md rounded-md font-sans"
        ></div>   
        </div>
  );
};

export default QRCodeScanner;
