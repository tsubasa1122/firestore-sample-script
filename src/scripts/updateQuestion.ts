import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { program } from "commander";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const main = async () => {
  program
    .option("-i, --id <questionId>", "question id")
    .option("-t, --title <title>", "question title")
    .option("-d, --description <description>", "question description")
    .parse(process.argv);

  const { id, title, description } = program.opts();

  if (!id) {
    throw new Error("質問のidが正しく設定されていません。");
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });

    const db = getFirestore();
    const questionRef = db.collection("Question").doc(id);

    const question = (await questionRef.get()).data();
    if (!question) {
      console.log(`質問:${id}は存在しません。`);
      return;
    }

    console.log(`質問:${id}を更新します。`);

    try {
      const newTitle = title ?? "";
      const newDescription = description ?? "";
      await questionRef.update({
        title: newTitle,
        description: newDescription,
      });
      console.log("success!");
    } catch (e) {
      console.log("failure:", e);
    }
  }
};

main();
