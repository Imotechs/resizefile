import * as pdfjsLib from "pdfjs-dist";
import PDFSplitter from "./components/PdfSplitter";
import { PushNotificationClient } from "push-notification-service/client";
import { useEffect } from "react";
// Set the worker source to the local path
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function App() {
  const pushClient = new PushNotificationClient({
    serverUrl: "http://localhost:8081",
    swPath: "/dist/sw.js",
    publicVapidKey:
      "BEI933NamyTJX3yq_O487ybrimEAVfw2aAnxOTLKkbyzAr-u-h5tIEhf8SMjslkDtlGXHUkN0Pz5jXpjredIkKU", // Use your public key
    userId: "testUser1",
  });

  useEffect(() => {
    async function initializeNotification() {
      try {
        const res = await pushClient.initialize();
        console.log(res);
        if (res) {
          console.log("Push notification initialized");
        } else {
          console.log("Failed to initialize push notification");
        }
      } catch (error) {
        console.error("Failed to initialize: " + error.message);
      }
    }

    initializeNotification();
  });

  const handleSendNotification = () => {
    try {
      pushClient.sendNotification({
        body: "Notification from JOHN-FIXIT",
        icon: "https://purepng.com/public/uploads/large/purepng.com-photos-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596102asedt.png",
        image:
          "https://purepng.com/public/uploads/large/purepng.com-photos-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596102asedt.png",
        badge:
          "https://purepng.com/public/uploads/large/purepng.com-photos-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596102asedt.png",
        url: "http://localhost:3006/",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={handleSendNotification}>Send Notification</button>
      <PDFSplitter />
    </>
  );
}

export default App;
