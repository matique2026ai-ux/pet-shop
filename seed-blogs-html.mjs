import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    slug: "secret-language-of-cats",
    content: {
      en: `
        <p>Cats are remarkable creatures with an intricate communication system. From the nuanced movements of their tails to the specific frequencies of their purrs, every action is a signal.</p>
        <h2>The Healing Power of Purring</h2>
        <p>Studies have shown that <strong>purring</strong> not only indicates contentment but also promotes tissue regeneration and bone healing, resonating at frequencies between <strong>25 and 140 Hertz</strong>.</p>
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/s1E1xXgPzCg" frameborder="0" allowfullscreen></iframe>
        <h2>The Science of Trust</h2>
        <p>Moreover, the phenomenon of the <em>'slow blink'</em> is scientifically linked to trust. By narrowing their eyes, cats are essentially lowering their defenses, indicating a state of relaxation. </p>
        <ul>
          <li><strong>Tail straight up:</strong> Friendly greeting.</li>
          <li><strong>Slow blink:</strong> Trust and affection.</li>
          <li><strong>Ears back:</strong> Fear or aggression.</li>
        </ul>
        <p>Understanding these subtle cues allows pet owners to forge a deeper, more empathetic bond with their feline companions.</p>
      `,
      fr: `
        <p>Les chats sont des créatures remarquables dotées d'un système de communication complexe. Des mouvements nuancés de leur queue aux fréquences spécifiques de leurs ronronnements, chaque action est un signal.</p>
        <h2>Le Pouvoir de Guérison du Ronronnement</h2>
        <p>Des études ont montré que le <strong>ronronnement</strong> n'indique pas seulement le contentement, mais favorise également la régénération des tissus et la guérison des os, résonnant à des fréquences comprises entre <strong>25 et 140 Hertz</strong>.</p>
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/s1E1xXgPzCg" frameborder="0" allowfullscreen></iframe>
        <h2>La Science de la Confiance</h2>
        <p>De plus, le phénomène du <em>clignement lent des yeux</em> est scientifiquement lié à la confiance. En plissant les yeux, les chats baissent essentiellement leurs défenses, ce qui indique un état de relaxation.</p>
        <ul>
          <li><strong>Queue dressée :</strong> Salutation amicale.</li>
          <li><strong>Clignement lent :</strong> Confiance et affection.</li>
          <li><strong>Oreilles en arrière :</strong> Peur ou agression.</li>
        </ul>
        <p>Comprendre ces indices subtils permet aux propriétaires d'animaux de tisser un lien plus profond et plus empathique avec leurs compagnons félins.</p>
      `,
      ar: `
        <p>تعتبر القطط كائنات مذهلة تمتلك نظام تواصل معقد للغاية. من الحركات الدقيقة لذيولها إلى الترددات الخاصة بخرخرتها، يعتبر كل تصرف بمثابة إشارة واضحة.</p>
        <h2>القوة العلاجية للخرخرة</h2>
        <p>أثبتت الدراسات العلمية الحديثة أن <strong>الخرخرة</strong> لا تدل فقط على الرضا، بل إنها تعزز تجديد الأنسجة والتئام العظام، حيث يتردد صداها بترددات تتراوح بين <strong>25 و 140 هرتز</strong>.</p>
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/s1E1xXgPzCg" frameborder="0" allowfullscreen></iframe>
        <h2>علم الثقة عند السنوريات</h2>
        <p>علاوة على ذلك، ترتبط ظاهرة <em>"الرمش البطيء"</em> علمياً بالثقة. من خلال تضييق عيونها، تقوم القطط أساساً بخفض دفاعاتها، مما يشير إلى حالة من الاسترخاء التام.</p>
        <ul>
          <li><strong>الذيل المرفوع عمودياً:</strong> تحية ودية.</li>
          <li><strong>الرمش البطيء:</strong> ثقة ومحبة.</li>
          <li><strong>الآذان المتراجعة للخلف:</strong> خوف أو استعداد للهجوم.</li>
        </ul>
        <p>إن فهم هذه الإشارات الدقيقة يسمح لأصحاب الحيوانات الأليفة بتكوين رابطة أعمق وأكثر تعاطفاً مع رفقائهم.</p>
      `
    }
  },
  {
    slug: "avian-intelligence",
    content: {
      en: `
        <p>Birds possess a level of cognitive complexity that is often severely underestimated. Research in comparative psychology reveals that parrots and corvids exhibit problem-solving skills comparable to those of young human children.</p>
        <h2>The Avian Brain</h2>
        <p>Their brains, though lacking a neocortex, have evolved a different structure known as the <strong>pallium</strong>, which supports advanced cognitive functions.</p>
        <img src="https://images.unsplash.com/photo-1494252713559-f26b4fb0c15e?w=800&q=80" alt="Parrot Intelligence" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>Environmental Enrichment</h2>
        <p>Providing environmental enrichment is not merely a luxury for pet birds; it is a neurological necessity.</p>
        <ol>
          <li><strong>Foraging puzzles:</strong> Simulates hunting for food.</li>
          <li><strong>Acoustic environments:</strong> Varied sounds and music.</li>
          <li><strong>Social interactions:</strong> Complex flock dynamics.</li>
        </ol>
        <p>Deprivation of these stimuli can lead to severe behavioral anomalies, underscoring the critical need for a stimulating habitat.</p>
      `,
      fr: `
        <p>Les oiseaux possèdent un niveau de complexité cognitive qui est souvent gravement sous-estimé. La recherche en psychologie comparative révèle que les perroquets et les corvidés présentent des capacités de résolution de problèmes comparables à celles de jeunes enfants humains.</p>
        <h2>Le Cerveau Aviaire</h2>
        <p>Leur cerveau, bien que dépourvu de néocortex, a développé une structure différente appelée le <strong>pallium</strong>, qui soutient des fonctions cognitives avancées.</p>
        <img src="https://images.unsplash.com/photo-1494252713559-f26b4fb0c15e?w=800&q=80" alt="Intelligence des perroquets" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>Enrichissement Environnemental</h2>
        <p>Fournir un enrichissement environnemental n'est pas simplement un luxe pour les oiseaux de compagnie ; c'est une nécessité neurologique.</p>
        <ol>
          <li><strong>Casse-têtes alimentaires :</strong> Simule la recherche de nourriture.</li>
          <li><strong>Environnements acoustiques :</strong> Sons variés et musique.</li>
          <li><strong>Interactions sociales :</strong> Dynamique de groupe complexe.</li>
        </ol>
        <p>La privation de ces stimuli peut entraîner de graves anomalies comportementales.</p>
      `,
      ar: `
        <p>تمتلك الطيور مستوى من التعقيد الإدراكي الذي غالباً ما يتم التقليل من شأنه بشدة. تكشف الأبحاث في علم النفس المقارن أن الببغاوات والغرابيات تظهر مهارات في حل المشكلات يمكن مقارنتها بمهارات الأطفال الصغار.</p>
        <h2>الدماغ المعجزة للطيور</h2>
        <p>أدمغتها، على الرغم من افتقارها إلى القشرة المخية الحديثة، طورت بنية مختلفة تُعرف باسم <strong>الباليوم (Pallium)</strong>، والتي تدعم الوظائف الإدراكية المتقدمة جداً.</p>
        <img src="https://images.unsplash.com/photo-1494252713559-f26b4fb0c15e?w=800&q=80" alt="ذكاء الببغاوات" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>أهمية البيئة المحفزة</h2>
        <p>إن توفير بيئة غنية بالمحفزات ليس مجرد رفاهية للطيور الأليفة؛ بل هو ضرورة عصبية ملحة.</p>
        <ol>
          <li><strong>ألعاب التفكير والبحث عن الطعام:</strong> تحفز الغريزة.</li>
          <li><strong>البيئات الصوتية:</strong> توفير أصوات متنوعة للتفاعل.</li>
          <li><strong>التفاعلات الاجتماعية:</strong> محاكاة حياة السرب.</li>
        </ol>
        <p>يمكن أن يؤدي الحرمان من هذه المحفزات إلى تشوهات سلوكية خطيرة، مما يؤكد الحاجة الماسة إلى بيئة محفزة.</p>
      `
    }
  },
  {
    slug: "canine-nutrition-science",
    content: {
      en: `
        <p>The domestic dog, <em>Canis lupus familiaris</em>, has evolved unique metabolic pathways diverging significantly from their wolf ancestors, particularly in carbohydrate digestion.</p>
        <h2>The Importance of Microbiome</h2>
        <p>Modern canine nutrition science emphasizes the importance of the gut <strong>microbiome</strong>, a complex ecosystem of bacteria that directly influences immune function and neurological health.</p>
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" alt="Dog Health" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>Essential Fatty Acids</h2>
        <p>Recent veterinary studies highlight the critical role of Omega-3 and Omega-6 fatty acids in reducing systemic inflammation and promoting cellular health. As we pivot from traditional highly-processed kibble to biologically appropriate diets, the integration of:</p>
        <ul>
          <li>Prebiotics and Probiotics</li>
          <li>High-quality bioavailable proteins</li>
          <li>Healthy fats</li>
        </ul>
        <p>is proving essential for maximizing the canine lifespan and vitality.</p>
      `,
      fr: `
        <p>Le chien domestique, <em>Canis lupus familiaris</em>, a développé des voies métaboliques uniques qui divergent considérablement de celles de ses ancêtres les loups, en particulier en ce qui concerne la digestion des glucides.</p>
        <h2>L'Importance du Microbiome</h2>
        <p>La science moderne de la nutrition canine souligne l'importance du <strong>microbiome</strong> intestinal, un écosystème complexe de bactéries qui influence directement la fonction immunitaire et la santé neurologique.</p>
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" alt="Santé du chien" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>Acides Gras Essentiels</h2>
        <p>Des études vétérinaires récentes mettent en évidence le rôle essentiel des acides gras Oméga-3 et Oméga-6 dans la réduction de l'inflammation systémique et la promotion de la santé cellulaire. L'intégration de :</p>
        <ul>
          <li>Prébiotiques et Probiotiques</li>
          <li>Protéines biodisponibles de haute qualité</li>
          <li>Graisses saines</li>
        </ul>
        <p>s'avère essentielle pour maximiser la durée de vie et la vitalité du chien.</p>
      `,
      ar: `
        <p>لقد طور الكلب الأليف، <em>(Canis lupus familiaris)</em>، مسارات استقلابية فريدة تختلف بشكل كبير عن أسلافه من الذئاب، لا سيما في القدرة على هضم الكربوهيدرات.</p>
        <h2>أهمية الميكروبيوم المعوي</h2>
        <p>يؤكد علم التغذية الحديث للكلاب على الأهمية البالغة <strong>لميكروبيوم الأمعاء</strong>، وهو نظام بيئي معقد من البكتيريا يؤثر بشكل مباشر على وظيفة المناعة والصحة العصبية.</p>
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" alt="صحة الكلاب" style="width:100%; border-radius:12px; margin:20px 0;"/>
        <h2>الأحماض الدهنية الأساسية</h2>
        <p>تسلط الدراسات البيطرية الحديثة الضوء على الدور الحاسم للأحماض الدهنية أوميغا 3 وأوميغا 6 في تقليل الالتهابات الجهازية وتعزيز صحة الخلايا. وبينما ننتقل من الوجبات الجافة التقليدية المعالجة، يثبت دمج ما يلي أهميته القصوى:</p>
        <ul>
          <li>البريبايوتكس والبروبيوتكس لدعم الأمعاء.</li>
          <li>البروتينات عالية الجودة سهلة الامتصاص.</li>
          <li>الدهون الصحية المفيدة للفرو والجلد.</li>
        </ul>
        <p>مما ينعكس مباشرة في زيادة الحيوية والعمر الافتراضي للكلاب.</p>
      `
    }
  }
];

async function updateBlogs() {
  console.log("Updating blogs to rich HTML formatting...");
  for (const article of articles) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ content: article.content })
      .eq('slug', article.slug);
    
    if (error) {
      console.error(`Failed to update ${article.slug}:`, error);
    } else {
      console.log(`Successfully updated ${article.slug} to rich text.`);
    }
  }
}

updateBlogs();
