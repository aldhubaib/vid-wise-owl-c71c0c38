import avatarCh1 from "@/assets/avatars/ch1.jpg";
import avatarCh2 from "@/assets/avatars/ch2.jpg";
import avatarCh3 from "@/assets/avatars/ch3.jpg";
import avatarCh4 from "@/assets/avatars/ch4.jpg";
import avatarCh5 from "@/assets/avatars/ch5.jpg";
import avatarCh6 from "@/assets/avatars/ch6.jpg";

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarImg: string;
  subscribers: string;
  views: string;
  videos: string;
  subscribersRaw: number;
  viewsRaw: number;
  videosRaw: number;
  lastSynced: string;
  active: boolean;
  joinedDate: string;
  country: string;
  avgViews: string;
  engRate: string;
  topCategory: string;
  growthSubs: string;
  growthViews: string;
}

export interface Video {
  id: string;
  channelId: string;
  title: string;
  type: "video" | "short";
  views: string;
  likes: string;
  comments: string;
  date: string;
  duration: string;
  status: "done" | "failed" | "pending" | "analyzing";
  viewsRaw: number;
  likesRaw: number;
  commentsRaw: number;
}

export const channels: Channel[] = [
  {
    id: "ch1",
    name: "منص بن سعيد",
    handle: "@dqh1",
    avatar: "م",
    avatarImg: avatarCh1,
    subscribers: "607K",
    views: "37.6M",
    videos: "126",
    subscribersRaw: 607000,
    viewsRaw: 37600000,
    videosRaw: 126,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Jan 2019",
    country: "SA",
    avgViews: "298K",
    engRate: "4.2%",
    topCategory: "Entertainment",
    growthSubs: "+2.4%",
    growthViews: "+5.1%",
  },
  {
    id: "ch2",
    name: "قرية العجائب | بدر العلوي",
    handle: "@badr3",
    avatar: "ق",
    avatarImg: avatarCh2,
    subscribers: "6.6M",
    views: "863.7M",
    videos: "282",
    subscribersRaw: 6600000,
    viewsRaw: 863700000,
    videosRaw: 282,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Mar 2017",
    country: "SA",
    avgViews: "3.1M",
    engRate: "6.8%",
    topCategory: "Entertainment",
    growthSubs: "+3.1%",
    growthViews: "+7.2%",
  },
  {
    id: "ch3",
    name: "طارق العلي",
    handle: "@tariq",
    avatar: "ط",
    avatarImg: avatarCh3,
    subscribers: "2.1M",
    views: "241.3M",
    videos: "198",
    subscribersRaw: 2100000,
    viewsRaw: 241300000,
    videosRaw: 198,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Jun 2018",
    country: "KW",
    avgViews: "1.2M",
    engRate: "5.5%",
    topCategory: "Comedy",
    growthSubs: "+1.8%",
    growthViews: "+3.9%",
  },
  {
    id: "ch4",
    name: "سارة الودعاني",
    handle: "@sarah_w",
    avatar: "س",
    avatarImg: avatarCh4,
    subscribers: "890K",
    views: "52.4M",
    videos: "87",
    subscribersRaw: 890000,
    viewsRaw: 52400000,
    videosRaw: 87,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Sep 2020",
    country: "SA",
    avgViews: "602K",
    engRate: "7.1%",
    topCategory: "Lifestyle",
    growthSubs: "+4.5%",
    growthViews: "+8.3%",
  },
  {
    id: "ch5",
    name: "عبدالرحمن المرشد",
    handle: "@amrshd",
    avatar: "ع",
    avatarImg: avatarCh5,
    subscribers: "1.3M",
    views: "98.7M",
    videos: "154",
    subscribersRaw: 1300000,
    viewsRaw: 98700000,
    videosRaw: 154,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Feb 2019",
    country: "SA",
    avgViews: "641K",
    engRate: "3.9%",
    topCategory: "Education",
    growthSubs: "+2.1%",
    growthViews: "+4.4%",
  },
  {
    id: "ch6",
    name: "نواف السالم",
    handle: "@nawaf_s",
    avatar: "ن",
    avatarImg: avatarCh6,
    subscribers: "445K",
    views: "18.2M",
    videos: "63",
    subscribersRaw: 445000,
    viewsRaw: 18200000,
    videosRaw: 63,
    lastSynced: "3/11/2026, 1:59 AM",
    active: true,
    joinedDate: "Nov 2021",
    country: "SA",
    avgViews: "289K",
    engRate: "5.2%",
    topCategory: "Tech",
    growthSubs: "+6.7%",
    growthViews: "+9.1%",
  },
];

export const videos: Video[] = [
  {
    id: "v1", channelId: "ch1",
    title: "كيف تبني مشروع ناجح من الصفر؟ | دليل شامل",
    type: "video", views: "1.2M", likes: "45K", comments: "2.3K",
    date: "2026-03-08", duration: "18:42", status: "done",
    viewsRaw: 1200000, likesRaw: 45000, commentsRaw: 2300,
  },
  {
    id: "v2", channelId: "ch1",
    title: "أسرار النجاح على يوتيوب في 2026",
    type: "video", views: "890K", likes: "32K", comments: "1.8K",
    date: "2026-03-05", duration: "24:15", status: "done",
    viewsRaw: 890000, likesRaw: 32000, commentsRaw: 1800,
  },
  {
    id: "v3", channelId: "ch1",
    title: "رحلتي إلى اليابان 🇯🇵",
    type: "video", views: "2.1M", likes: "78K", comments: "4.1K",
    date: "2026-03-01", duration: "32:08", status: "done",
    viewsRaw: 2100000, likesRaw: 78000, commentsRaw: 4100,
  },
  {
    id: "v4", channelId: "ch1",
    title: "لحظة لا تنسى! 😱",
    type: "short", views: "5.4M", likes: "210K", comments: "8.9K",
    date: "2026-02-28", duration: "0:58", status: "analyzing",
    viewsRaw: 5400000, likesRaw: 210000, commentsRaw: 8900,
  },
  {
    id: "v5", channelId: "ch1",
    title: "تحدي الأكل الحار 🌶️ | ردة فعل صادمة",
    type: "short", views: "3.2M", likes: "145K", comments: "5.6K",
    date: "2026-02-25", duration: "0:45", status: "done",
    viewsRaw: 3200000, likesRaw: 145000, commentsRaw: 5600,
  },
  {
    id: "v6", channelId: "ch1",
    title: "مقابلة حصرية مع أشهر يوتيوبر عربي",
    type: "video", views: "670K", likes: "28K", comments: "1.5K",
    date: "2026-02-20", duration: "45:30", status: "failed",
    viewsRaw: 670000, likesRaw: 28000, commentsRaw: 1500,
  },
  {
    id: "v7", channelId: "ch1",
    title: "أفضل 10 تطبيقات لازم تعرفها",
    type: "video", views: "445K", likes: "19K", comments: "980",
    date: "2026-02-15", duration: "15:22", status: "pending",
    viewsRaw: 445000, likesRaw: 19000, commentsRaw: 980,
  },
  {
    id: "v8", channelId: "ch1",
    title: "يوم كامل مع عائلتي ❤️",
    type: "video", views: "920K", likes: "41K", comments: "2.1K",
    date: "2026-02-10", duration: "22:17", status: "done",
    viewsRaw: 920000, likesRaw: 41000, commentsRaw: 2100,
  },
];

export const videoAnalysis = {
  summary: "فيديو شامل يتناول خطوات بناء مشروع ناجح من الصفر، يغطي التخطيط والتنفيذ والتسويق. يقدم نصائح عملية مبنية على تجارب حقيقية مع أمثلة من السوق السعودي.",
  summaryEn: "A comprehensive video covering steps to build a successful project from scratch, including planning, execution, and marketing. Provides practical advice based on real experiences with examples from the Saudi market.",
  topics: ["ريادة الأعمال", "التسويق الرقمي", "إدارة المشاريع", "التجارة الإلكترونية"],
  keywords: ["مشروع", "نجاح", "تسويق", "خطة عمل", "ريادة"],
  sentiment: { positive: 72, negative: 8, neutral: 20 },
  emotions: [
    { name: "Inspiration", emoji: "✨", pct: 34 },
    { name: "Curiosity", emoji: "🤔", pct: 28 },
    { name: "Excitement", emoji: "🔥", pct: 22 },
    { name: "Trust", emoji: "🤝", pct: 16 },
  ],
  questions: [
    { text: "كم رأس المال المطلوب للبدء؟", count: 142 },
    { text: "هل تنصح بالشراكة أو العمل الفردي؟", count: 89 },
    { text: "ما أفضل منصة للتسويق؟", count: 67 },
  ],
  viral: {
    score: 8.4,
    shareability: "High",
    trending: true,
    hookStrength: 9.1,
    retentionDrop: "12%",
    avgWatchPct: "67%",
  },
  moments: [
    { time: "02:15", text: "لحظة الكشف عن استراتيجية التسويق المجانية" },
    { time: "08:42", text: "قصة الفشل الأولى وكيف تحولت لنجاح" },
    { time: "14:30", text: "النصيحة الذهبية لكل رائد أعمال مبتدئ" },
  ],
  contentIdeas: [
    { hook: "٥ أخطاء قاتلة يرتكبها رواد الأعمال الجدد", concept: "فيديو متابعة يركز على الأخطاء الشائعة المذكورة في التعليقات" },
    { hook: "تحدي بناء مشروع في ٣٠ يوم", concept: "سلسلة فيديوهات توثق رحلة بناء مشروع حقيقي خطوة بخطوة" },
  ],
  comments: [
    { author: "محمد الشمري", date: "Mar 8", text: "والله محتوى رائع، استفدت كثير من النقطة حق التسويق بدون ميزانية", likes: 234, sentiment: "positive" as const },
    { author: "نورة العتيبي", date: "Mar 8", text: "ليش ما تكلمت عن التجارة الإلكترونية بشكل أعمق؟ حسيت إنها مرت بسرعة", likes: 89, sentiment: "question" as const },
    { author: "فهد القحطاني", date: "Mar 9", text: "جربت الطريقة وفعلاً نجحت! شكراً منص 🔥", likes: 156, sentiment: "positive" as const },
  ],
  pipeline: [
    { name: "Transcription", status: "done" as const, time: "2m 14s" },
    { name: "Translation", status: "done" as const, time: "1m 32s" },
    { name: "Sentiment Analysis", status: "done" as const, time: "3m 08s" },
    { name: "Topic Extraction", status: "done" as const, time: "1m 45s" },
    { name: "Comment Analysis", status: "done" as const, time: "4m 22s" },
    { name: "Viral Scoring", status: "done" as const, time: "0m 58s" },
  ],
};
