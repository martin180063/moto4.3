import React, { useState } from 'react';
import { Layout } from './Layout';
import { Tab, DayItinerary } from './types';
import { Checklist } from './Checklist';
import { AiBikeAnalyzer } from './AiBikeAnalyzer';
import { AiPhotoEditor } from './AiPhotoEditor';
import { RouteMap } from './RouteMap';
import { WeatherCard } from './WeatherCard';
// --- Data Definitions ---

const checkListItems = [
  "輪胎檢查 (胎紋深度、胎壓、龜裂)",
  "煞車系統 (煞車皮、煞車油、拉桿手感)",
  "機油/齒輪油 (油量、是否到了更換里程)",
  "燈光系統 (大燈、方向燈、煞車燈)",
  "傳動系統 (鏈條鬆緊度/上油、皮帶狀況)",
  "電瓶電壓 (發動是否順暢)",
  "懸吊系統 (是否有漏油)",
  "行照、駕照、保險卡有效期限"
];

const prepItems = [
  "全罩/3/4安全帽 (鏡片清潔)",
  "兩截式雨衣 (含雨鞋套)",
  "防摔手套、防摔衣",
  "簡易維修工具組 (補胎包、打氣機)",
  "個人換洗衣物 (排汗衫佳)",
  "行動電源 & 充電線",
  "現金 (部分加油站/小吃店不收卡)",
  "急救包 (OK繃、優碘)",
  "導航支架確認穩固"
];

const itineraryData: Record<string, DayItinerary> = {
  [Tab.DAY1]: {
    title: "第一天：台三線縱走",
    description: "沿著浪漫台三線南下，穿梭在山林彎道之間，最終抵達南投秘境露營。",
    weatherLoc: { lat: 23.757, lng: 120.686, name: "南投竹山" },
    items: [
      { 
        time: "07:30", 
        activity: "泰山出發", 
        note: "走台 65 下土城，銜接 台 3 線 南下。避開 09:00 後的拜拜車潮。",
        mapQuery: "新北市泰山區",
        lat: 25.059,
        lng: 121.434
      },
      { 
        time: "08:45", 
        activity: "龍潭大池 / 7-11 龍池門市", 
        note: "第一次休息。地址：桃園市龍潭區中豐路上林段187號 (空間大)。",
        mapQuery: "7-ELEVEN 龍池門市",
        lat: 24.864,
        lng: 121.216
      },
      { 
        time: "10:00", 
        activity: "新竹峨眉 / 全家休息", 
        note: "地址：新竹縣峨眉鄉27-17號。進入彎道區前補給，享受台 3 線風景。",
        mapQuery: "全家便利商店 峨眉台三線店",
        lat: 24.685,
        lng: 121.015
      },
      { 
        time: "11:30", 
        activity: "苗栗獅潭 (午餐)", 
        note: "抵達 仙山仙草 或 星巴克獅潭門市。必喝：仙草蜜。在此補滿油。",
        mapQuery: "仙山仙草",
        lat: 24.544,
        lng: 120.923
      },
      { 
        time: "13:00", 
        activity: "台中東勢 / 霧峰", 
        note: "快速通過台中路段，往南投前進。此段紅綠燈較多，請保持耐心。",
        mapQuery: "台中市東勢區",
        lat: 24.258,
        lng: 120.829
      },
      { 
        time: "13:45", 
        activity: "南投竹山市區", 
        note: "最後補給站：全聯、加油站。中油竹山站 務必加滿油。",
        mapQuery: "台灣中油竹山站",
        lat: 23.757,
        lng: 120.686
      },
      { 
        time: "14:15", 
        activity: "開始爬山 (投49-1)", 
        note: "往「山思雲想」前進 (約 12 公里山路)。路窄、彎急，雙載請注意引擎煞車。",
        mapQuery: "投49-1鄉道",
        lat: 23.700,
        lng: 120.750
      },
      { 
        time: "14:50", 
        activity: "抵達山思雲想", 
        note: "辦理入住，準備參加 15:00 活動。剛好趕上營地活動開始！",
        mapQuery: "山思雲想",
        lat: 23.682,
        lng: 120.765
      }
    ]
  },
  [Tab.DAY2]: {
    title: "第二天：文創與茶香",
    description: "走訪全台最旺財神廟，漫步日式車埕，品味日月潭紅茶。",
    weatherLoc: { lat: 23.852, lng: 120.903, name: "日月潭" },
    items: [
      { 
        time: "08:00", 
        activity: "晨間暖車", 
        note: "檢查煞車功能與胎壓，整理裝備準備出發。",
        lat: 23.682,
        lng: 120.765 
      },
      { 
        time: "09:30", 
        activity: "紫南宮：財源廣進", 
        note: "大年初二求財必衝！機車請走防汛道路進入。記得：求發財金、摸金雞、鑰匙過爐。",
        mapQuery: "竹山紫南宮",
        tag: "💰 求財戰區",
        tagColor: "#ffd700",
        tagTextColor: "#856404",
        lat: 23.812,
        lng: 120.724
      },
      { 
        time: "12:00", 
        activity: "車埕林班道：木作時光", 
        note: "在最美日式車站旁DIY。推薦：木桶便當、儲木池散步、手作木板凳。", 
        mapQuery: "車埕林班道商圈",
        tag: "🎨 文創手作",
        tagColor: "#795548",
        tagTextColor: "#ffffff",
        backgroundColor: "#fdf5f2",
        lat: 23.832,
        lng: 120.866
      },
      { 
        time: "14:30", 
        activity: "Hohocha：紅玉茶香", 
        note: "進入日月潭前的最後優雅，體驗免費奉茶與茶葉蛋。", 
        mapQuery: "HOHOCHA喝喝茶",
        tag: "📸 網美景點",
        tagColor: "#4caf50",
        tagTextColor: "#ffffff",
        backgroundColor: "#f1f8e9",
        lat: 23.892,
        lng: 120.924
      },
      { 
        time: "16:30", 
        activity: "前往住宿點", 
        note: "沿著台21線享受山路騎乘，往廬山溫泉前進。",
        lat: 23.950,
        lng: 120.950
      },
      { 
        time: "18:30", 
        activity: "溫泉飯店晚餐", 
        note: "泡湯消除疲勞，享受寧靜夜晚。", 
        mapQuery: "廬山溫泉",
        lat: 24.024,
        lng: 121.187 
      }
    ]
  },
  [Tab.DAY3]: {
    title: "第三天：湖光山色與都市",
    description: "告別日月潭的寧靜，前往台中感受文青氣息與百萬夜景。",
    weatherLoc: { lat: 24.146, lng: 120.662, name: "台中市區" },
    items: [
      { 
        time: "09:00", 
        activity: "晨喚出發", 
        note: "享用飯店早餐，整理行李準備退房，沿台14線下山。",
        mapQuery: "台14線",
        lat: 24.024,
        lng: 121.187
      },
      { 
        time: "10:30", 
        activity: "📸 向山：清水模建築", 
        note: "在日月潭最美角落留下合照。欣賞湖光山色與獨特建築美學。",
        mapQuery: "向山行政暨遊客中心",
        tag: "必拍大片",
        tagColor: "#673ab7",
        tagTextColor: "#ffffff",
        backgroundColor: "#f3e5f5",
        lat: 23.852,
        lng: 120.903
      },
      { 
        time: "13:00", 
        activity: "午餐時光", 
        note: "行經草屯或霧峰，品嚐在地美食。", 
        lat: 24.062,
        lng: 120.699
      },
      { 
        time: "15:30", 
        activity: "🍦 審計新村：市區漫遊", 
        note: "台中最強文創聚落，買個泡芙、逛逛職人市集。", 
        mapQuery: "審計新村",
        tag: "都市文藝",
        tagColor: "#e91e63",
        tagTextColor: "#ffffff",
        backgroundColor: "#fce4ec",
        lat: 24.146,
        lng: 120.662
      },
      { 
        time: "18:00", 
        activity: "🌌 沙鹿夜景：禾淞津別邸", 
        note: "入住質感旅宿，晚上去大肚山看璀璨的台中港夜景。", 
        mapQuery: "禾淞津別邸",
        tag: "浪漫極致",
        tagColor: "#3f51b5",
        tagTextColor: "#ffffff",
        backgroundColor: "#e8eaf6",
        lat: 24.226,
        lng: 120.575
      }
    ]
  },
  [Tab.DAY4]: {
    title: "第四天：海線風情與歸途",
    description: "沿著西部濱海公路北上，享受風車、大海與最後的旅程。",
    weatherLoc: { lat: 24.603, lng: 120.732, name: "苗栗後龍" },
    items: [
      { 
        time: "10:30", 
        activity: "🌬️ 高美濕地：風車與海", 
        note: "沙鹿出發，看巨大的風車在海邊旋轉。", 
        mapQuery: "高美濕地",
        tag: "海線浪漫",
        tagColor: "#03a9f4",
        tagTextColor: "#ffffff",
        backgroundColor: "#e1f5fe",
        lat: 24.312,
        lng: 120.550
      },
      { 
        time: "12:00", 
        activity: "🔭 後龍好望角：絕美視野", 
        note: "居高臨下俯瞰太平洋，看海線火車緩緩駛過。",
        mapQuery: "後龍好望角",
        tag: "海景第一排",
        tagColor: "#ff5722",
        tagTextColor: "#ffffff",
        backgroundColor: "#fff3e0",
        lat: 24.603,
        lng: 120.732
      },
      { 
        time: "18:00", 
        activity: "🧧 平安抵達：開工大吉", 
        note: "這趟 4 天 3 夜的旅程辛苦了！帶回滿滿的能量，迎接新的一年。 🧧💼🏍️",
        tagColor: "#4caf50",
        backgroundColor: "#e8f5e9",
        lat: 25.033,
        lng: 121.565
      }
    ]
  }
};

const ItineraryView: React.FC<{ day: DayItinerary, dayId: string }> = ({ day, dayId }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{day.title}</h2>
          <p className="mt-2 text-lg text-slate-600">{day.description}</p>
        </div>
        <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-sm
              ${showMap 
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
            <span className="material-symbols-rounded">{showMap ? 'visibility_off' : 'map'}</span>
            {showMap ? '隱藏地圖' : '查看路線'}
        </button>
      </div>

      {day.weatherLoc && (
        <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
           <WeatherCard lat={day.weatherLoc.lat} lng={day.weatherLoc.lng} locationName={day.weatherLoc.name} />
        </div>
      )}
      
      <div className="relative border-l-2 border-slate-400/30 pl-8 ml-4 space-y-8">
        {day.items.map((item, idx) => {
          const mapUrl = item.mapQuery 
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapQuery)}`
            : null;

          return (
            <div 
              key={idx} 
              className="relative group animate-slide-up"
              style={{ 
                animationDelay: `${idx * 0.15 + 0.1}s`,
                animationFillMode: 'both' 
              }}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white bg-sky-500 shadow-md transition-all group-hover:scale-125 group-hover:bg-sky-600"></div>
              
              <div 
                className="flex flex-col gap-3 rounded-2xl p-5 transition-all hover:shadow-md md:flex-row md:items-start backdrop-blur-sm"
                style={{
                   backgroundColor: item.backgroundColor || 'rgba(255, 255, 255, 0.85)',
                   borderLeft: item.tagColor ? `4px solid ${item.tagColor}` : undefined
                }}
              >
                <div className="min-w-[80px] pt-1">
                  <span className="font-mono text-lg font-bold text-sky-700">{item.time}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xl font-bold text-slate-800">{item.activity}</h4>
                      {item.tag && (
                        <span 
                          className="inline-block rounded-md px-2 py-0.5 text-xs font-bold shadow-sm"
                          style={{ 
                            backgroundColor: item.tagColor || '#e2e8f0', 
                            color: item.tagTextColor || '#475569' 
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                      {mapUrl && (
                        <a 
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-center gap-1 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-600 transition-all hover:bg-blue-600 hover:text-white ml-auto sm:ml-2"
                          title="在 Google Maps 開啟"
                        >
                          <span className="material-symbols-rounded text-sm">map</span>
                          <span className="hidden sm:inline">地圖</span>
                        </a>
                      )}
                    </div>
                    
                    {item.note && (
                       <div className="mt-2 text-slate-600 text-sm leading-relaxed bg-white/50 p-3 rounded-lg border border-slate-100/50">
                         {item.note}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showMap && (
        <div className="animate-fade-in">
           <RouteMap allData={itineraryData} currentDayId={dayId} />
        </div>
      )}

      {/* Integrated AI Photo Editor for Daily Logs */}
      <div className="pt-4">
        <AiPhotoEditor />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.CHECK);

  const renderContent = () => {
    switch (currentTab) {
      case Tab.CHECK:
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-800">機車全面體檢</h2>
              <p className="text-slate-600">出發前的檢查是平安回家的關鍵。</p>
            </div>
            <Checklist title="必備檢查項目" items={checkListItems} />
            <AiBikeAnalyzer />
          </div>
        );
      case Tab.PREP:
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-800">行李裝備確認</h2>
              <p className="text-slate-600">輕量化打包，但不遺漏重要物品。</p>
            </div>
            <Checklist title="行李清單" items={prepItems} />
          </div>
        );
      case Tab.DAY1:
      case Tab.DAY2:
      case Tab.DAY3:
      case Tab.DAY4:
        return (
            <div key={currentTab}>
                <ItineraryView day={itineraryData[currentTab]} dayId={currentTab} />
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
      <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
