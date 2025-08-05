-- Create about_page table
CREATE TABLE IF NOT EXISTS "about_page" (
    "id" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL DEFAULT 'Über',
    "titleFa" TEXT NOT NULL DEFAULT 'درباره ما',
    "storyTitleDe" TEXT NOT NULL DEFAULT 'Unsere Geschichte',
    "storyTitleFa" TEXT NOT NULL DEFAULT 'داستان ما',
    "storyContentDe" TEXT NOT NULL,
    "storyContentFa" TEXT NOT NULL,
    "storyImage" TEXT,
    "missionTitleDe" TEXT NOT NULL DEFAULT 'Unsere Mission',
    "missionTitleFa" TEXT NOT NULL DEFAULT 'ماموریت ما',
    "missionContentDe" TEXT NOT NULL,
    "missionContentFa" TEXT NOT NULL,
    "valuesTitleDe" TEXT NOT NULL DEFAULT 'Unsere Werte',
    "valuesTitleFa" TEXT NOT NULL DEFAULT 'ارزش‌های ما',
    "value1TitleDe" TEXT NOT NULL DEFAULT 'Qualität',
    "value1TitleFa" TEXT NOT NULL DEFAULT 'کیفیت',
    "value1ContentDe" TEXT NOT NULL,
    "value1ContentFa" TEXT NOT NULL,
    "value2TitleDe" TEXT NOT NULL DEFAULT 'Innovation',
    "value2TitleFa" TEXT NOT NULL DEFAULT 'نوآوری',
    "value2ContentDe" TEXT NOT NULL,
    "value2ContentFa" TEXT NOT NULL,
    "value3TitleDe" TEXT NOT NULL DEFAULT 'Inklusion',
    "value3TitleFa" TEXT NOT NULL DEFAULT 'شمول',
    "value3ContentDe" TEXT NOT NULL,
    "value3ContentFa" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_page_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert default about page data
INSERT INTO "about_page" (
    "id", 
    "storyContentDe", 
    "storyContentFa", 
    "storyImage",
    "missionContentDe", 
    "missionContentFa",
    "value1ContentDe", 
    "value1ContentFa",
    "value2ContentDe", 
    "value2ContentFa",
    "value3ContentDe", 
    "value3ContentFa",
    "adminId",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'Derakhte Kherad wurde 2015 mit der Vision gegründet, eine Brücke zwischen persischer und deutscher Kultur zu schaffen. Wir haben uns von einem kleinen Sprachzentrum zu einer renommierten Institution entwickelt.',
    'درخت خرد در سال 2015 با چشم‌انداز ایجاد پلی بین فرهنگ ایرانی و آلمانی تأسیس شد. ما از یک مرکز کوچک زبان به یک مؤسسه معتبر تبدیل شده‌ایم.',
    '/images/about-image-1.jpg',
    'Wir bei Derakhte Kherad glauben, dass Sprache der Schlüssel zum interkulturellen Verständnis ist. Unsere Mission ist es, qualitativ hochwertige Sprachkurse anzubieten, die sowohl sprachliche Fähigkeiten als auch kulturelles Wissen vermitteln.',
    'ما در درخت خرد بر این باوریم که زبان کلید درک بین فرهنگی است. ماموریت ما ارائه دوره‌های زبان با کیفیت بالا است که هم مهارت‌های زبانی و هم دانش فرهنگی را منتقل می‌کند.',
    'Wir streben nach Exzellenz in allen Aspekten unserer Arbeit und verpflichten uns, die höchsten Standards in der Sprachbildung zu erfüllen.',
    'ما به دنبال برتری در تمام جنبه‌های کار خود هستیم و متعهد می‌شویم که بالاترین استانداردها را در آموزش زبان برآورده کنیم.',
    'Wir entwickeln ständig neue Lehrmethoden und integrieren moderne Technologien, um das Lernerlebnis zu verbessern.',
    'ما دائماً روش‌های آموزشی جدید را توسعه می‌دهیم و فناوری‌های مدرن را ادغام می‌کنیم تا تجربه یادگیری را بهبود بخشیم.',
    'Wir schaffen eine einladende Umgebung für Lernende aller Hintergründe und fördern eine vielfältige und integrative Gemeinschaft.',
    'ما محیطی دعوت‌کننده برای یادگیرندگان از همه پیشینه‌ها ایجاد می‌کنیم و جامعه‌ای متنوع و فراگیر را ترویج می‌دهیم.',
    (SELECT "id" FROM "Admin" LIMIT 1),
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING; 