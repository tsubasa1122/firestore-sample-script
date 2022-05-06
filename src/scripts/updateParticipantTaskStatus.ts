import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { program } from "commander";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const NEW_QUESTION_STATUS = "完了";

const main = async () => {
  program.parse(process.argv);
  const userId = program.args[0];
  const questionId = program.args[1];
  if (!userId || !questionId) {
    throw new Error("ユーザーのidもしくは質問のidが正しく設定されていません。");
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });

    const db = getFirestore();
    // 本当はUserではなく、Participantで登録したい
    const userRef = db.collection("User").doc(userId);
    const questionRef = await userRef.collection("questions").doc(questionId);

    const question = (await questionRef.get()).data();
    if (!question || question.status === NEW_QUESTION_STATUS) {
      console.log(`質問:${questionId}はスキップしました。`);
      return;
    }

    console.log(
      `ユーザー:${userId} 質問:${questionId}のステータスを完了にします。`
    );

    try {
      await questionRef.update({ status: NEW_QUESTION_STATUS });
      console.log("success!");
    } catch (e) {
      console.log("failure:", e);
    }
  }
};

main();
