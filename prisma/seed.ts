import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@derakhtekherad.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@derakhtekherad.com',
      password: adminPassword,
      role: 'ADMIN',
      admin: {
        create: {}
      }
    },
    include: {
      admin: true
    }
  });

  console.log(`Admin created with id: ${admin.id} and profile id: ${admin.admin?.id}`);

  // Create the admin profile separately
  const adminProfile = await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id
    }
  });

  console.log('Created admin user:', admin.email, 'with profile ID:', adminProfile.id);

  // Create teacher users
  const teachersData = [
    {
      email: 'mueller@derakhtekherad.com',
      name: 'Dr. Müller',
      password: 'teacher123',
      bio: 'Experienced German teacher with over 10 years of teaching experience.',
      bioFa: 'معلم آلمانی با تجربه با بیش از 10 سال سابقه تدریس.',
      specialties: 'A1, A2, Conversation',
      photo: '/images/teachers/mueller.jpg'
    },
    {
      email: 'weber@derakhtekherad.com',
      name: 'Sarah Weber',
      password: 'teacher123',
      bio: 'Specialized in teaching German grammar and writing skills.',
      bioFa: 'متخصص در آموزش گرامر و مهارت‌های نوشتاری آلمانی.',
      specialties: 'B1, B2, Grammar',
      photo: '/images/teachers/weber.jpg'
    },
    {
      email: 'bauer@derakhtekherad.com',
      name: 'Prof. Bauer',
      password: 'teacher123',
      bio: 'Professor of German literature with a focus on contemporary works.',
      bioFa: 'استاد ادبیات آلمانی با تمرکز بر آثار معاصر.',
      specialties: 'C1, C2, Literature',
      photo: '/images/teachers/bauer.jpg'
    },
    {
      email: 'fischer@derakhtekherad.com',
      name: 'Frau Fischer',
      password: 'teacher123',
      bio: 'Specializes in conversational German for everyday situations.',
      bioFa: 'متخصص در مکالمه آلمانی برای موقعیت‌های روزمره.',
      specialties: 'A1, A2, B1, Conversation',
      photo: '/images/teachers/fischer.jpg'
    }
  ];

  const teachers = [];
  const teacherProfiles = [];

  for (const teacherData of teachersData) {
    const password = await hash(teacherData.password, 10);
    const teacher = await prisma.user.upsert({
      where: { email: teacherData.email },
      update: {},
      create: {
        email: teacherData.email,
        name: teacherData.name,
        password,
        role: 'TEACHER'
      }
    });
    
    // Create teacher profile separately
    const teacherProfile = await prisma.teacher.upsert({
      where: { userId: teacher.id },
      update: {
        bio: teacherData.bio,
        bioFa: teacherData.bioFa,
        specialties: teacherData.specialties,
        photo: teacherData.photo
      },
        create: {
        userId: teacher.id,
        bio: teacherData.bio,
        bioFa: teacherData.bioFa,
        specialties: teacherData.specialties,
        photo: teacherData.photo
      }
    });
    
    teachers.push({
      ...teacher,
      teacherProfile: teacherProfile
    });
    teacherProfiles.push(teacherProfile);
    console.log('Created teacher:', teacher.email, 'with profile ID:', teacherProfile.id);
  }

  // Create blog posts
  console.log("Creating blog posts...");
  
  // Create blog posts using the Prisma client directly
  try {
    // Get admin ID first
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      throw new Error("No admin user found to associate with blog posts");
    }
    
    const adminId = admin.id;
    console.log("Using admin ID for blog posts:", adminId);
    
    // Create blog posts directly with Prisma client
    const blogPosts = [
      {
        title: 'Deutsche Grammatik Meistern: Ein Leitfaden für Anfänger',
        titleFa: 'تسلط بر گرامر آلمانی: راهنمای مبتدیان',
        slug: 'mastering-german-grammar',
        excerpt: 'Lernen Sie die Grundlagen der deutschen Grammatik, um eine solide Basis für Ihre Sprachreise zu schaffen.',
        excerptFa: 'اصول گرامر آلمانی را بیاموزید تا پایه محکمی برای سفر زبانی خود ایجاد کنید.',
        content: '<h2>Einführung in die deutsche Grammatik</h2><p>Die deutsche Grammatik mag zunächst schwierig erscheinen, aber mit konsequentem Üben und dem richtigen Ansatz können Sie sie effektiv beherrschen.</p><h3>Die Grundlagen der deutschen Fälle</h3><p>Das Deutsche hat vier Fälle: Nominativ, Akkusativ, Dativ und Genitiv. Jeder Fall erfüllt eine bestimmte Funktion im Satz.</p>',
        contentFa: '<h2>مقدمه‌ای بر گرامر آلمانی</h2><p>گرامر آلمانی ممکن است در ابتدا چالش‌برانگیز به نظر برسد، اما با تمرین مداوم و رویکرد درست، می‌توانید به طور مؤثر بر آن تسلط پیدا کنید.</p>',
        author: 'Dr. Anna Schmidt',
        authorImage: '/images/authors/anna-schmidt.jpg',
        publishDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        isPublished: true,
        category: 'Grammar',
        categoryFa: 'گرامر',
        thumbnailUrl: '/images/blog/german-grammar.jpg',
        adminId: adminId
      },
      {
        title: 'Der Weg zur C1-Kompetenz: Fortgeschrittene Strategien für Deutsch',
        titleFa: 'مسیر دستیابی به مهارت C1: استراتژی‌های پیشرفته آلمانی',
        slug: 'path-to-c1-proficiency',
        excerpt: 'Entdecken Sie effektive Strategien, um C1-Niveau in Deutsch zu erreichen und Ihre Sprachkenntnisse zu verbessern.',
        excerptFa: 'استراتژی‌های مؤثر برای رسیدن به سطح C1 در زبان آلمانی و ارتقاء مهارت‌های زبانی خود را کشف کنید.',
        content: '<h2>Über das Mittelniveau hinaus</h2><p>Um C1-Kompetenz zu erreichen, bedarf es gezielter Anstrengungen und strategischer Lernansätze. Dieser Leitfaden bietet bewährte Methoden, um fortgeschrittene Sprachkenntnisse zu erlangen.</p>',
        contentFa: '<h2>پیشرفت فراتر از سطح متوسط آلمانی</h2><p>رسیدن به تسلط C1 نیازمند تلاش مداوم و رویکردهای یادگیری استراتژیک است. این راهنما روش‌های اثبات‌شده‌ای را برای کمک به شما در دستیابی به روانی پیشرفته ارائه می‌دهد.</p>',
        author: 'Prof. Martin Weber',
        authorImage: '/images/authors/martin-weber.jpg',
        publishDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        isPublished: true,
        category: 'Advanced Learning',
        categoryFa: 'یادگیری پیشرفته',
        thumbnailUrl: '/images/blog/c1-proficiency.jpg',
        adminId: adminId
      },
      {
        title: 'Wirtschaftsdeutsch: Wesentliche Kommunikationsfähigkeiten',
        titleFa: 'آلمانی برای کسب و کار: مهارت‌های ارتباطی ضروری',
        slug: 'german-for-business',
        excerpt: 'Lernen Sie, wie Sie in deutschen Geschäftsumgebungen effektiv kommunizieren und Ihre beruflichen Aussichten verbessern können.',
        excerptFa: 'یاد بگیرید چگونه در محیط‌های تجاری آلمانی به طور مؤثر ارتباط برقرار کنید و چشم‌انداز حرفه‌ای خود را ارتقا دهید.',
        content: '<h2>Wirtschaftsdeutsch: Mehr als Grundvokabular</h2><p>Berufsbezogenes Deutsch erfordert spezialisiertes Vokabular und Verständnis der Geschäftsetikette. Dieser Artikel behandelt wesentliche Aspekte der Geschäftskommunikation auf Deutsch.</p>',
        contentFa: '<h2>آلمانی تجاری: فراتر از واژگان پایه</h2><p>آلمانی حرفه‌ای نیازمند واژگان تخصصی و درک آداب معاشرت تجاری است. این مقاله جنبه‌های اساسی ارتباطات تجاری به زبان آلمانی را پوشش می‌دهد.</p>',
        author: 'Dr. Claudia Müller',
        authorImage: '/images/authors/claudia-muller.jpg',
        publishDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        isPublished: true,
        category: 'Business German',
        categoryFa: 'آلمانی تجاری',
        thumbnailUrl: '/images/blog/business-german.jpg',
        adminId: adminId
      },
      {
        title: 'Deutsch lernen durch Musik und Film',
        titleFa: 'یادگیری آلمانی از طریق موسیقی و فیلم',
        slug: 'german-through-music-film',
        excerpt: 'Entdecken Sie, wie Sie deutsche Musik und Filme als effektive Werkzeuge für den Spracherwerb und das kulturelle Verständnis nutzen können.',
        excerptFa: 'کشف کنید چگونه از موسیقی و فیلم‌های آلمانی به عنوان ابزارهای مؤثر برای یادگیری زبان و درک فرهنگی استفاده کنید.',
        content: '<h2>Unterhaltung als Lernwerkzeug</h2><p>Musik und Film bieten unterhaltsame Möglichkeiten, Ihr deutsches Sprachverständnis, Ihre Aussprache und Ihr kulturelles Wissen zu verbessern, während Sie hochwertige Unterhaltung genießen.</p>',
        contentFa: '<h2>سرگرمی به عنوان ابزار یادگیری</h2><p>موسیقی و فیلم راه‌های جذابی را برای بهبود درک، تلفظ و دانش فرهنگی آلمانی شما ارائه می‌دهند، در حالی که از سرگرمی با کیفیت لذت می‌برید.</p>',
        author: 'Sophie Becker',
        authorImage: '/images/authors/sophie-becker.jpg',
        publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        isPublished: true,
        category: 'Culture & Learning',
        categoryFa: 'فرهنگ و یادگیری',
        thumbnailUrl: '/images/blog/german-media.jpg',
        adminId: adminId
      }
    ];
    
    // Add blog posts directly to database with raw SQL for each post to ensure it works
    for (const post of blogPosts) {
      // Use dynamic import for Prisma client since 'blogPost' doesn't exist in the TypeScript types
      const result = await (prisma as any).$executeRawUnsafe(`
        INSERT INTO "BlogPost" (
          "id", "title", "titleFa", "slug", "excerpt", "excerptFa", 
          "content", "contentFa", "author", "authorImage", 
          "publishDate", "isPublished", "category", "categoryFa", 
          "thumbnailUrl", "adminId", "createdAt", "updatedAt"
        ) 
        VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
        ON CONFLICT ("slug") DO UPDATE 
        SET 
          "title" = $1,
          "titleFa" = $2,
          "excerpt" = $4,
          "excerptFa" = $5,
          "content" = $6,
          "contentFa" = $7,
          "author" = $8,
          "authorImage" = $9,
          "publishDate" = $10,
          "isPublished" = $11,
          "category" = $12,
          "categoryFa" = $13,
          "thumbnailUrl" = $14,
          "adminId" = $15,
          "updatedAt" = $17
      `, 
        post.title, 
        post.titleFa, 
        post.slug, 
        post.excerpt, 
        post.excerptFa, 
        post.content, 
        post.contentFa, 
        post.author, 
        post.authorImage, 
        post.publishDate, 
        post.isPublished, 
        post.category, 
        post.categoryFa, 
        post.thumbnailUrl, 
        post.adminId,
        new Date(),
        new Date()
      );
      
      console.log(`Created/updated blog post: ${post.title}`);
    }
  } catch (error) {
    console.error("Error creating blog posts:", error);
  }

  // Create student users
  const studentsData = [
    {
      email: 'anna@example.com',
      name: 'Anna Schmidt',
      password: 'student123',
      phone: '+49123456789'
    },
    {
      email: 'mehdi@example.com',
      name: 'Mehdi Karimi',
      password: 'student123',
      phone: '+989123456789'
    },
    {
      email: 'laura@example.com',
      name: 'Laura Müller',
      password: 'student123',
      phone: '+49987654321'
    },
    {
      email: 'ali@example.com',
      name: 'Ali Ahmadi',
      password: 'student123',
      phone: '+989876543210'
    }
  ];

  const students = [];
  const studentProfiles = [];

  for (const studentData of studentsData) {
    const password = await hash(studentData.password, 10);
    const student = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        name: studentData.name,
        password,
        role: 'STUDENT'
      }
    });
    
    // Create student profile separately
    const studentProfile = await prisma.student.upsert({
      where: { userId: student.id },
      update: {
        phone: studentData.phone
      },
      create: {
        userId: student.id,
        phone: studentData.phone
      }
    });
    
    students.push({
      ...student,
      studentProfile: studentProfile
    });
    studentProfiles.push(studentProfile);
    console.log('Created student:', student.email, 'with profile ID:', studentProfile.id);
  }

  // Create courses
  const coursesData = [
    {
      title: 'Deutschkurs A1',
      titleFa: 'دوره آلمانی A1',
      description: '<p>Beginnen Sie Ihre Reise zum Deutschlernen mit unserem umfassenden A1-Kurs für Anfänger. Dieser Kurs deckt alle Grundlagen der deutschen Sprache ab, einschließlich Aussprache, Grammatik und Alltagsvokabular.</p>',
      descriptionFa: '<p>سفر یادگیری زبان آلمانی خود را با دوره جامع A1 ما که برای مبتدیان طراحی شده است آغاز کنید. این دوره تمام اصول اولیه زبان آلمانی از جمله تلفظ، گرامر و واژگان روزمره را پوشش می‌دهد.</p>',
      level: 'A1',
      capacity: 15,
      price: 1000,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-03-01'),
      timeSlot: 'Mon, Wed 18:00-20:00',
      location: 'Online',
      teacherId: teachers[0].teacherProfile!.id,
      featured: true,
      isActive: true
    },
    {
      title: 'Deutschkurs B1',
      titleFa: 'دوره آلمانی B1',
      description: '<p>Bringen Sie Ihre Deutschkenntnisse mit unserem B1-Kurs auf ein mittleres Niveau. Lernen Sie komplexere Grammatik, erweitern Sie Ihren Wortschatz und üben Sie Konversationen aus dem wirklichen Leben.</p>',
      descriptionFa: '<p>مهارت‌های زبان آلمانی خود را با دوره B1 ما به سطح متوسط برسانید. گرامر پیچیده‌تر را بیاموزید، واژگان خود را گسترش دهید و مکالمات واقعی را تمرین کنید.</p>',
      level: 'B1',
      capacity: 12,
      price: 1200,
      startDate: new Date('2023-11-15'),
      endDate: new Date('2024-02-15'),
      timeSlot: 'Tue, Thu 17:00-19:00',
      location: 'Online',
      teacherId: teachers[1].teacherProfile!.id,
      featured: true,
      isActive: true
    },
    {
      title: 'Deutsche Literatur',
      titleFa: 'ادبیات آلمانی',
      description: '<p>Entdecken Sie die reiche Welt der deutschen Literatur von klassischen Werken bis hin zu zeitgenössischen Autoren. Verbessern Sie Ihre fortgeschrittenen Deutschkenntnisse durch literarische Analyse und Diskussionen.</p>',
      descriptionFa: '<p>دنیای غنی ادبیات آلمانی را از آثار کلاسیک تا نویسندگان معاصر کشف کنید. مهارت‌های پیشرفته آلمانی خود را از طریق تحلیل ادبی و بحث بهبود بخشید.</p>',
      level: 'C1',
      capacity: 10,
      price: 1500,
      startDate: new Date('2023-12-15'),
      endDate: new Date('2024-03-15'),
      timeSlot: 'Fri 16:00-20:00',
      location: 'Online',
      teacherId: teachers[2].teacherProfile!.id,
      featured: false,
      isActive: true
    },
    {
      title: 'Deutsche Konversation',
      titleFa: 'مکالمه آلمانی',
      description: '<p>Verbessern Sie Ihre Sprechfähigkeiten mit unserem konversationsorientierten Kurs. Üben Sie Alltagssituationen, bauen Sie Selbstvertrauen auf und lernen Sie kulturelle Nuancen in der deutschen Konversation.</p>',
      descriptionFa: '<p>مهارت‌های گفتاری خود را با دوره متمرکز بر مکالمه ما بهبود بخشید. موقعیت‌های روزمره را تمرین کنید، اعتماد به نفس ایجاد کنید و ظرافت‌های فرهنگی در مکالمه آلمانی را بیاموزید.</p>',
      level: 'A2',
      capacity: 8,
      price: 900,
      startDate: new Date('2023-11-10'),
      endDate: new Date('2024-01-10'),
      timeSlot: 'Sat 10:00-12:00',
      location: 'Online',
      teacherId: teachers[3].teacherProfile!.id,
      featured: true,
      isActive: true
    },
    {
      title: 'TestDaF Vorbereitung',
      titleFa: 'آمادگی آزمون TestDaF',
      description: '<p>Umfassende Vorbereitung auf die TestDaF-Prüfung mit Fokus auf alle vier Fähigkeiten: Lesen, Hören, Schreiben und Sprechen. Inklusive Übungstests und persönlichem Feedback.</p>',
      descriptionFa: '<p>آمادگی جامع برای آزمون TestDaF، با تمرینات جامع و آزمون‌های عملی، خود را برای آزمون TestDaF آماده کنید.</p>',
      level: 'C1',
      capacity: 12,
      price: 1800,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-02-15'),
      timeSlot: 'Tue, Thu 18:00-21:00',
      location: 'Online',
      teacherId: teachers[0].teacherProfile!.id,
      featured: false,
      isActive: true
    }
  ];

  const courses = [];

  for (const courseData of coursesData) {
    const course = await prisma.course.upsert({
      where: {
        id: `course-${courseData.title.replace(/\s+/g, '-').toLowerCase()}`
      },
      update: courseData,
      create: {
        id: `course-${courseData.title.replace(/\s+/g, '-').toLowerCase()}`,
        ...courseData,
        adminId: adminProfile.id
      }
    });
    courses.push(course);
    console.log('Created course:', course.title);
  }

  // Create modules for each course
  for (const course of courses) {
    const moduleCount = Math.floor(Math.random() * 3) + 2; // 2-4 modules per course
    
    for (let i = 1; i <= moduleCount; i++) {
      const module = await prisma.courseModule.create({
        data: {
          title: `Module ${i}: ${i === 1 ? 'Introduction' : i === 2 ? 'Core Concepts' : i === 3 ? 'Advanced Topics' : 'Practical Application'}`,
          titleFa: `ماژول ${i}: ${i === 1 ? 'مقدمه' : i === 2 ? 'مفاهیم اصلی' : i === 3 ? 'موضوعات پیشرفته' : 'کاربرد عملی'}`,
          description: `Detailed overview of what students will learn in module ${i}`,
          descriptionFa: `توضیحات دقیق در مورد آنچه دانش‌آموزان در ماژول ${i} خواهند آموخت`,
          orderIndex: i,
          courseId: course.id
        }
      });
      console.log('Created module:', module.title, 'for course:', course.title);
      
      // Create 2-4 lessons for each module
      const lessonCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 1; j <= lessonCount; j++) {
        const lesson = await prisma.lesson.create({
          data: {
            title: `Lesson ${j}: Topic ${j}`,
            titleFa: `درس ${j}: موضوع ${j}`,
            content: `<h2>Lesson ${j}</h2><p>Detailed content of lesson ${j} in module ${i}.</p><ul><li>Key point 1</li><li>Key point 2</li><li>Key point 3</li></ul>`,
            contentFa: `<h2>درس ${j}</h2><p>محتوای دقیق درس ${j} در ماژول ${i}.</p><ul><li>نکته کلیدی 1</li><li>نکته کلیدی 2</li><li>نکته کلیدی 3</li></ul>`,
            duration: 30 + (j * 10), // Minutes
            orderIndex: j,
            moduleId: module.id
          }
        });
        console.log('Created lesson:', lesson.title, 'for module:', module.title);
        
        // Create 1-2 materials for each lesson
        const materialCount = Math.floor(Math.random() * 2) + 1;
        
        for (let k = 1; k <= materialCount; k++) {
          const materialTypes = ['DOCUMENT', 'VIDEO', 'LINK'];
          const randomType = materialTypes[Math.floor(Math.random() * materialTypes.length)] as 'DOCUMENT' | 'VIDEO' | 'LINK';
          
          const material = await prisma.material.create({
            data: {
              title: `Material ${k}: ${randomType.charAt(0) + randomType.slice(1).toLowerCase()}`,
              titleFa: `منبع ${k}: ${randomType === 'DOCUMENT' ? 'سند' : randomType === 'VIDEO' ? 'ویدیو' : 'لینک'}`,
              description: `Supplementary ${randomType.toLowerCase()} for lesson ${j}`,
              descriptionFa: `منبع تکمیلی ${randomType === 'DOCUMENT' ? 'سند' : randomType === 'VIDEO' ? 'ویدیو' : 'لینک'} برای درس ${j}`,
              type: randomType,
              url: randomType === 'DOCUMENT' 
                ? '/materials/sample-document.pdf' 
                : randomType === 'VIDEO' 
                  ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                  : 'https://www.goethe.de/',
              lessonId: lesson.id
            }
          });
          console.log('Created material:', material.title, 'for lesson:', lesson.title);
        }
      }
    }
  }

  // Create hero slides
  const heroSlidesData = [
    {
      title: 'Deutsch lernen mit den Besten',
      titleFa: 'آلمانی را با بهترین‌ها بیاموزید',
      description: 'Nehmen Sie an unseren von Experten geleiteten Deutschkursen teil und beginnen Sie noch heute Ihren Weg zur Sprachbeherrschung',
      descriptionFa: 'به دوره‌های آلمانی با هدایت متخصصان ما بپیوندید و سفر روانی خود را امروز آغاز کنید',
      imageUrl: '/images/slides/german-classroom.jpg',
      buttonOneText: 'Kurse ansehen',
      buttonOneFa: 'مشاهده دوره‌ها',
      buttonOneLink: '/courses',
      buttonTwoText: 'Kontakt',
      buttonTwoFa: 'تماس با ما',
      buttonTwoLink: '/contact',
      isActive: true,
      orderIndex: 1
    },
    {
      title: 'Bereit für TestDaF',
      titleFa: 'برای آزمون TestDaF آماده شوید',
      description: 'Unsere spezialisierten Vorbereitungskurse helfen Ihnen, Ihre deutsche Sprachprüfung erfolgreich zu bestehen',
      descriptionFa: 'دوره‌های آمادگی تخصصی ما به شما کمک می‌کند در آزمون مهارت آلمانی خود موفق شوید',
      imageUrl: '/images/slides/test-preparation.jpg',
      buttonOneText: 'Mehr erfahren',
      buttonOneFa: 'اطلاعات بیشتر',
      buttonOneLink: '/courses/testdaf',
      isActive: true,
      orderIndex: 2
    },
    {
      title: 'Online und Präsenzunterricht',
      titleFa: 'کلاس‌های آنلاین و حضوری',
      description: 'Flexible Lernmöglichkeiten, die zu Ihrem Zeitplan und Lernstil passen',
      descriptionFa: 'گزینه‌های یادگیری انعطاف‌پذیر برای تناسب با برنامه و سبک یادگیری شما',
      imageUrl: '/images/slides/online-learning.jpg',
      buttonOneText: 'Zeitplan ansehen',
      buttonOneFa: 'مشاهده برنامه',
      buttonOneLink: '/schedule',
      isActive: true,
      orderIndex: 3
    }
  ];

  for (const slideData of heroSlidesData) {
    const slide = await prisma.heroSlide.upsert({
      where: {
        id: `slide-${slideData.orderIndex}`
      },
      update: slideData,
      create: {
        id: `slide-${slideData.orderIndex}`,
        ...slideData,
        adminId: adminProfile.id
      }
    });
    console.log('Created hero slide:', slide.title);
  }

  // Create feature items
  const featureItemsData = [
    {
      title: 'Qualifizierte Lehrkräfte',
      titleFa: 'معلمان با صلاحیت',
      description: 'Lernen Sie von Muttersprachlern und zertifizierten Sprachlehrern',
      descriptionFa: 'از سخنگویان مادری آلمانی و مربیان زبان دارای گواهینامه بیاموزید',
      iconName: 'UserGroupIcon',
      isActive: true,
      orderIndex: 1
    },
    {
      title: 'Moderne Lernmethoden',
      titleFa: 'روش‌های مدرن یادگیری',
      description: 'Wir verwenden die neuesten Lehrmethoden und Technologien',
      descriptionFa: 'ما از جدیدترین روش‌ها و فناوری‌های آموزشی استفاده می‌کنیم',
      iconName: 'AcademicCapIcon',
      isActive: true,
      orderIndex: 2
    },
    {
      title: 'Kleine Klassengrößen',
      titleFa: 'اندازه کلاس کوچک',
      description: 'Persönliche Betreuung in Gruppen von maximal 15 Studierenden',
      descriptionFa: 'توجه شخصی در گروه‌های حداکثر 15 دانش‌آموز',
      iconName: 'UsersIcon',
      isActive: true,
      orderIndex: 3
    }
  ];

  for (const featureData of featureItemsData) {
    const feature = await prisma.featureItem.upsert({
      where: {
        id: `feature-${featureData.orderIndex}`
      },
      update: featureData,
    create: {
        id: `feature-${featureData.orderIndex}`,
        ...featureData,
        adminId: adminProfile.id
      }
    });
    console.log('Created feature item:', feature.title);
  }

  // Create statistics
  console.log("Creating statistics...");
  
  try {
    // Get admin for associations
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      throw new Error("No admin user found to associate with statistics");
    }
    
    // Create sample statistics
    const statistics = [
      {
        title: 'Total Users',
        titleFa: 'تعداد کاربران',
        value: '254',
        orderIndex: 1,
        isActive: true,
        adminId: admin.id
      },
      {
        title: 'Active Courses',
        titleFa: 'دوره‌های فعال',
        value: '12',
        orderIndex: 2,
        isActive: true,
        adminId: admin.id
      },
      {
        title: 'New Students',
        titleFa: 'دانش‌آموزان جدید',
        value: '48',
        orderIndex: 3,
        isActive: true,
        adminId: admin.id
      },
      {
        title: 'Revenue',
        titleFa: 'درآمد',
        value: '12540',
        orderIndex: 4,
        isActive: true,
        adminId: admin.id
      }
    ];
    
    for (const stat of statistics) {
      await prisma.statistic.upsert({
        where: { 
          id: `stat-${stat.orderIndex}`
        },
        update: {
          title: stat.title,
          titleFa: stat.titleFa,
          value: stat.value,
          orderIndex: stat.orderIndex,
          isActive: stat.isActive
        },
        create: {
          id: `stat-${stat.orderIndex}`,
          title: stat.title,
          titleFa: stat.titleFa,
          value: stat.value,
          orderIndex: stat.orderIndex,
          isActive: stat.isActive,
          adminId: admin.id
        }
      });
    }
    
    console.log("Created statistics successfully");
  } catch (error) {
    console.error("Error creating statistics:", error);
  }
  
  // Create courses with different levels
  console.log("Creating courses...");
  
  try {
    // Get admin and teacher to associate with courses
    const admin = await prisma.admin.findFirst();
    const teacher = await prisma.teacher.findFirst();
    
    if (!admin) {
      throw new Error("No admin user found to associate with courses");
    }
    
    if (!teacher) {
      throw new Error("No teacher found to associate with courses");
    }
    
    const courseLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const courseData = [
      {
        id: 'course-deutschkurs-a1',
        title: 'Deutschkurs A1',
        titleFa: 'دوره آلمانی A1',
        description: 'Ein Einführungskurs in die deutsche Sprache für absolute Anfänger.',
        descriptionFa: 'یک دوره مقدماتی در زبان آلمانی برای مبتدیان مطلق.',
        level: 'A1',
        price: 99.99,
        capacity: 15,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000), // 8 weeks + 1 week from now
        timeSlot: "Mon, Wed 18:00-20:00",
        location: "Online",
        isActive: true
      },
      {
        id: 'course-deutsche-konversation',
        title: 'Deutsche Konversation',
        titleFa: 'مکالمه آلمانی',
        description: 'Lernen Sie grundlegende Konversationsfähigkeiten für alltägliche Situationen.',
        descriptionFa: 'مهارت‌های اساسی مکالمه برای موقعیت‌های روزمره را بیاموزید.',
        level: 'A2',
        price: 119.99,
        capacity: 12,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000), // 10 weeks from now
        timeSlot: "Tue, Thu 17:00-19:00",
        location: "Berlin, Room 101",
        isActive: true
      },
      {
        id: 'course-deutschkurs-b1',
        title: 'Deutschkurs B1',
        titleFa: 'دوره آلمانی B1',
        description: 'Erweitern Sie Ihr Vokabular und üben Sie reale Situationen.',
        descriptionFa: 'واژگان خود را گسترش دهید و موقعیت‌های واقعی را تمرین کنید.',
        level: 'B1',
        price: 129.99,
        capacity: 10,
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        endDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000), // 12 weeks + 3 weeks from now
        timeSlot: "Mon, Wed, Fri 10:00-12:00",
        location: "Online",
        isActive: true
      },
      {
        id: 'course-deutsche-literatur',
        title: 'Deutsche Literatur',
        titleFa: 'ادبیات آلمانی',
        description: 'Erforschen Sie klassische und zeitgenössische deutsche Literaturwerke.',
        descriptionFa: 'آثار ادبی کلاسیک و معاصر آلمانی را کاوش کنید.',
        level: 'C1',
        price: 249.99,
        capacity: 8,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        endDate: new Date(Date.now() + 142 * 24 * 60 * 60 * 1000), // 16 weeks + 1 month from now
        timeSlot: "Sat 09:00-13:00",
        location: "Berlin, Room 205",
        isActive: true
      },
      {
        id: 'course-testdaf-preparation',
        title: 'TestDaF Preparation',
        titleFa: 'آمادگی آزمون TestDaF',
        description: 'Bereiten Sie sich auf die TestDaF-Prüfung vor mit umfassenden Übungen und Praxistests.',
        descriptionFa: 'با تمرینات جامع و آزمون‌های عملی، خود را برای آزمون TestDaF آماده کنید.',
        level: 'C1',
        price: 299.99,
        capacity: 8,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        endDate: new Date(Date.now() + 98 * 24 * 60 * 60 * 1000), // 14 weeks from now
        timeSlot: "Tue, Thu 18:00-21:00",
        location: "Online",
        isActive: true
      }
    ];
    
    // Create courses with different registration dates
    const courses = [];
    for (const course of courseData) {
      const createdCourse = await prisma.course.upsert({
        where: { id: course.id },
        update: {},
        create: {
          id: course.id,
          title: course.title,
          titleFa: course.titleFa,
          description: course.description,
          descriptionFa: course.descriptionFa,
          level: course.level,
          price: course.price,
          capacity: course.capacity,
          startDate: course.startDate,
          endDate: course.endDate,
          timeSlot: course.timeSlot,
          location: course.location,
          isActive: course.isActive,
          teacherId: teacher.id,
          adminId: admin.id
        }
      });
      courses.push(createdCourse);
      console.log(`Created course: ${course.title} (Level ${course.level})`);
    }
    
    // Create modules for courses
    for (const course of courses) {
      // Create 4-6 modules per course
      const moduleCount = Math.floor(Math.random() * 3) + 4; // 4-6 modules
      
      for (let i = 1; i <= moduleCount; i++) {
        const courseModule = await prisma.courseModule.create({
          data: {
            title: `Module ${i}: ${course.title.split(' ')[0]} Lessons`,
            titleFa: `ماژول ${i}: دروس ${course.titleFa.split(' ')[0]}`,
            description: `This module covers important aspects of ${course.title}.`,
            descriptionFa: `این ماژول جنبه‌های مهم ${course.titleFa} را پوشش می‌دهد.`,
            orderIndex: i,
            courseId: course.id
          }
        });
        
        // Create 2-4 assignments per module
        const assignmentCount = Math.floor(Math.random() * 3) + 2; // 2-4 assignments
        
        for (let j = 1; j <= assignmentCount; j++) {
          await prisma.assignment.create({
            data: {
              title: `Assignment ${j}`,
              titleFa: `تکلیف ${j}`,
              description: `Complete the exercises for module ${i}.`,
              descriptionFa: `تمرینات برای ماژول ${i} را کامل کنید.`,
              dueDate: new Date(Date.now() + (30 + i * j) * 24 * 60 * 60 * 1000),
              courseId: course.id,
              teacherId: teacher.id
            }
          });
        }
      }
    }
    
    console.log("Created courses with modules and assignments");
    
    // Create students and enrollments with submissions
    const studentsData2 = [];
    
    // Generate registration dates for the last 6 months
    const getRandomDate = (months: number): Date => {
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * months));
      date.setDate(Math.floor(Math.random() * 28) + 1); // Random day 1-28
      return date;
    }
    
    // Create additional students with varying registration dates
    for (let i = 1; i <= 50; i++) {
      const registrationDate = getRandomDate(6);
      
      studentsData2.push({
        email: `student${i}@example.com`,
        name: `Student ${i}`,
        password: 'student123',
        createdAt: registrationDate
      });
    }
    
    // Create the students
    const additionalStudents = [];
    const additionalStudentProfiles = [];
    
    for (const studentData of studentsData2) {
      const password = await hash(studentData.password, 10);
      const student = await prisma.user.create({
        data: {
          email: studentData.email,
          name: studentData.name,
          password,
          role: 'STUDENT',
          createdAt: studentData.createdAt
        }
      });
      
      // Create student profile separately
      const studentProfile = await prisma.student.create({
        data: {
          userId: student.id
        }
      });
      
      additionalStudents.push({
        ...student,
        _studentProfile: studentProfile // Using a different property name to avoid type issues
      });
      additionalStudentProfiles.push(studentProfile);
    }
    
    console.log(`Created ${additionalStudents.length} additional students with varying registration dates`);
    
    // Create enrollments with random dates
    for (const student of additionalStudents) {
      const studentProfile = student._studentProfile;
      
      // Enroll in 1-3 random courses
      const enrollmentCount = Math.floor(Math.random() * 3) + 1;
      const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
      const selectedCourses = shuffledCourses.slice(0, enrollmentCount);
      
      for (const course of selectedCourses) {
        const enrollDate = getRandomDate(6);
        
        const enrollment = await prisma.enrollment.create({
          data: {
            studentId: studentProfile.id,
            courseId: course.id,
            enrollDate: enrollDate,
            status: 'ACTIVE'
          }
        });
        
        // Get all assignments for this course
        const assignments = await prisma.assignment.findMany({
          where: {
            courseId: course.id
          }
        });
        
        // Create submissions for some assignments
        const submissionCount = Math.floor(assignments.length * (0.3 + Math.random() * 0.7));
        const shuffledAssignments = [...assignments].sort(() => 0.5 - Math.random());
        const selectedAssignments = shuffledAssignments.slice(0, submissionCount);
        
        for (const assignment of selectedAssignments) {
          // Create submission with 70% chance of being graded
          const isGraded = Math.random() > 0.3;
          
          await prisma.submission.create({
            data: {
              studentId: studentProfile.id,
              assignmentId: assignment.id,
              content: 'Submission content goes here',
              submittedAt: new Date(enrollDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
              grade: isGraded ? Math.floor(Math.random() * 4) + 7 : null, // Grade 7-10 if graded
              feedback: isGraded ? 'Good work!' : null
            }
          });
        }
      }
    }
    
    console.log("Created enrollments and submissions");
    
  } catch (error) {
    console.error("Error creating courses and enrollments:", error);
  }

  // Add charter data
  console.log("Creating charters...");
  
  try {
    // Get admin ID first
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      throw new Error("No admin user found to associate with charters");
    }
    
    const adminId = admin.id;
    console.log("Using admin ID for charters:", adminId);
    
    // Create charter principles
    const charters = [
      {
        title: 'Hohe Qualitätsstandards',
        titleFa: 'استانداردهای کیفی بالا',
        description: 'Wir verpflichten uns zu höchster Qualität in Lehre und Lernmaterialien. Unsere Lehrer werden sorgfältig ausgewählt und kontinuierlich geschult, um sicherzustellen, dass sie effektive und inspirierende Bildung vermitteln können.\n\nDas bedeutet für uns konkret:\n\n• Ausschließliche Beschäftigung von qualifizierten Sprachlehrern mit anerkannten Zertifikaten\n• Regelmäßige Lehrerfortbildungen zu modernsten Unterrichtsmethoden\n• Einsatz hochwertiger und aktueller Lernmaterialien\n• Strenge Qualitätskontrollen durch regelmäßiges Feedback\n• Kleine Klassengrößen für intensiveres Lernen',
        descriptionFa: 'ما متعهد به ارائه بالاترین کیفیت در آموزش و مواد آموزشی هستیم. معلمان ما با دقت انتخاب می‌شوند و به طور مداوم آموزش می‌بینند تا اطمینان حاصل شود که می‌توانند آموزش مؤثر و الهام‌بخش ارائه دهند.\n\nبرای ما این به معنای:\n\n• استخدام انحصاری معلمان زبان واجد شرایط با گواهینامه‌های معتبر\n• آموزش‌های منظم معلمان در مورد جدیدترین روش‌های تدریس\n• استفاده از مواد آموزشی با کیفیت بالا و به‌روز\n• کنترل‌های سختگیرانه کیفیت از طریق بازخورد منظم\n• اندازه کوچک کلاس‌ها برای یادگیری عمیق‌تر',
        orderIndex: 1,
        isActive: true,
        iconName: 'quality',
        adminId: adminId
      },
      {
        title: 'Kulturelles Verständnis',
        titleFa: 'درک فرهنگی',
        description: 'Wir fördern nicht nur Sprachkenntnisse, sondern auch ein tiefes Verständnis der deutschen Kultur, Geschichte und Gesellschaft. Wir glauben, dass Sprachenlernen eine Brücke zwischen Kulturen schlägt.\n\nDiesen Ansatz verwirklichen wir durch:\n\n• Integration kultureller Themen in den Sprachunterricht\n• Veranstaltung von kulturellen Workshops und Exkursionen\n• Austausch über kulturelle Unterschiede und Gemeinsamkeiten\n• Einbeziehung aktueller gesellschaftlicher Themen\n• Förderung des interkulturellen Dialogs zwischen Studierenden',
        descriptionFa: 'ما نه تنها مهارت‌های زبانی بلکه درک عمیقی از فرهنگ، تاریخ و جامعه آلمان را نیز ترویج می‌دهیم. ما معتقدیم یادگیری زبان پلی بین فرهنگ‌ها می‌سازد.\n\nما این رویکرد را از طریق موارد زیر به واقعیت تبدیل می‌کنیم:\n\n• ادغام موضوعات فرهنگی در آموزش زبان\n• برگزاری کارگاه‌های فرهنگی و گردش‌های علمی\n• تبادل نظر درباره تفاوت‌ها و شباهت‌های فرهنگی\n• گنجاندن موضوعات اجتماعی فعلی\n• ترویج گفتگوی بین فرهنگی در میان دانشجویان',
        orderIndex: 2,
        isActive: true,
        iconName: 'culture',
        adminId: adminId
      },
      {
        title: 'Innovative Lehrmethoden',
        titleFa: 'روش‌های آموزشی نوآورانه',
        description: 'Unsere Lehrmethoden vereinen bewährte pädagogische Praktiken mit innovativen Techniken. Wir setzen modernste Technologie und kreative Ansätze ein, um das Lernen ansprechend und effektiv zu gestalten.\n\nUnsere innovativen Methoden umfassen:\n\n• Kombiniertes Lernen mit digitalen und traditionellen Materialien\n• Interaktive Sprachübungen und Rollenspiele\n• Gamification-Elemente zur Steigerung der Motivation\n• Immersive Lernumgebungen mit Multimedia-Inhalten\n• Fortschrittliche digitale Lernplattformen mit KI-Unterstützung',
        descriptionFa: 'روش‌های آموزشی ما شیوه‌های آموزشی آزموده شده را با تکنیک‌های نوآورانه ترکیب می‌کند. ما از فناوری پیشرفته و رویکردهای خلاقانه استفاده می‌کنیم تا یادگیری را جذاب و مؤثر کنیم.\n\nروش‌های نوآورانه ما شامل:\n\n• یادگیری ترکیبی با مواد دیجیتال و سنتی\n• تمرین‌های تعاملی زبان و ایفای نقش\n• عناصر بازی‌سازی برای افزایش انگیزه\n• محیط‌های یادگیری غوطه‌ور با محتوای چندرسانه‌ای\n• پلتفرم‌های پیشرفته یادگیری دیجیتال با پشتیبانی هوش مصنوعی',
        orderIndex: 3,
        isActive: true,
        iconName: 'innovation',
        adminId: adminId
      },
      {
        title: 'Individuelle Betreuung',
        titleFa: 'پشتیبانی فردی',
        description: 'Wir erkennen an, dass jeder Lernende einzigartig ist. Unsere Lehrpläne und Unterrichtsmethoden sind flexibel und können an individuelle Bedürfnisse, Lernstile und Ziele angepasst werden.\n\nUnsere personalisierte Betreuung beinhaltet:\n\n• Individuelle Lernpläne basierend auf persönlichen Zielen\n• Regelmäßige Fortschrittsüberprüfungen und Anpassungen\n• Zusätzliche Unterstützung für Bereiche mit Verbesserungsbedarf\n• Berücksichtigung verschiedener Lernstile und -präferenzen\n• Persönliche Beratungsgespräche zur Optimierung des Lernprozesses',
        descriptionFa: 'ما تشخیص می‌دهیم که هر فراگیر منحصر به فرد است. برنامه‌های درسی و روش‌های آموزشی ما انعطاف‌پذیر است و می‌تواند با نیازها، سبک‌های یادگیری و اهداف فردی تطبیق داده شود.\n\nپشتیبانی شخصی‌سازی شده ما شامل موارد زیر است:\n\n• برنامه‌های یادگیری فردی بر اساس اهداف شخصی\n• بررسی‌های منظم پیشرفت و تنظیمات\n• پشتیبانی اضافی برای حوزه‌هایی که نیاز به بهبود دارند\n• در نظر گرفتن سبک‌ها و ترجیحات مختلف یادگیری\n• جلسات مشاوره شخصی برای بهینه‌سازی فرآیند یادگیری',
        orderIndex: 4,
        isActive: true,
        iconName: 'support',
        adminId: adminId
      },
      {
        title: 'Globale Perspektive',
        titleFa: 'دیدگاه جهانی',
        description: 'Als internationale Sprachschule bringen wir vielfältige Perspektiven in unseren Unterricht ein. Wir bereiten Lernende darauf vor, in einer zunehmend vernetzten Welt zu navigieren und zu kommunizieren.\n\nUnsere globale Ausrichtung zeigt sich in:\n\n• Internationalem Lehrpersonal mit diversen Hintergründen\n• Lernmaterialien, die globale Themen behandeln\n• Austauschprogrammen mit Partnerinstitutionen weltweit\n• Vorbereitung auf internationale Sprachzertifikate\n• Förderung eines globalen Mindsets und interkultureller Kompetenz',
        descriptionFa: 'به عنوان یک آموزشگاه زبان بین‌المللی، دیدگاه‌های متنوعی را در آموزش خود ارائه می‌دهیم. ما یادگیرندگان را برای هدایت و برقراری ارتباط در جهانی که به طور فزاینده‌ای به هم متصل است، آماده می‌کنیم.\n\nجهت‌گیری جهانی ما در موارد زیر نمایان است:\n\n• کادر آموزشی بین‌المللی با پیشینه‌های متنوع\n• مواد آموزشی که به موضوعات جهانی می‌پردازند\n• برنامه‌های تبادل با مؤسسات همکار در سراسر جهان\n• آمادگی برای گواهینامه‌های زبان بین‌المللی\n• تقویت ذهنیت جهانی و شایستگی بین فرهنگی',
        orderIndex: 5,
        isActive: true,
        iconName: 'global',
        adminId: adminId
      },
      {
        title: 'Kontinuierliches Wachstum',
        titleFa: 'رشد مداوم',
        description: 'Wir streben nach kontinuierlicher Verbesserung und Innovation in allem, was wir tun. Unser Institut entwickelt sich ständig weiter, um die besten Bildungserfahrungen zu bieten und auf dem neuesten Stand der Sprachlehrmethoden zu bleiben.\n\nUnser Engagement für Wachstum manifestiert sich durch:\n\n• Regelmäßige Überprüfung und Aktualisierung unserer Lehrpläne\n• Investitionen in die berufliche Entwicklung unserer Lehrkräfte\n• Implementierung von Feedback-Mechanismen für kontinuierliche Verbesserung\n• Erforschung und Einführung neuer Technologien und Methoden\n• Zusammenarbeit mit Bildungsexperten und führenden Institutionen',
        descriptionFa: 'ما به دنبال بهبود و نوآوری مستمر در همه کارهایی که انجام می‌دهیم هستیم. مؤسسه ما به طور مداوم در حال تکامل است تا بهترین تجربیات آموزشی را ارائه دهد و با جدیدترین روش‌های آموزش زبان همگام باشد.\n\nتعهد ما به رشد از طریق موارد زیر آشکار می‌شود:\n\n• بررسی و به‌روزرسانی منظم برنامه‌های درسی ما\n• سرمایه‌گذاری در توسعه حرفه‌ای معلمان ما\n• پیاده‌سازی سازوکارهای بازخورد برای بهبود مستمر\n• تحقیق و معرفی فناوری‌ها و روش‌های جدید\n• همکاری با کارشناسان آموزشی و مؤسسات پیشرو',
        orderIndex: 6,
        isActive: true,
        iconName: 'growth',
        adminId: adminId
      },
      {
        title: 'Praktische Anwendung',
        titleFa: 'کاربرد عملی',
        description: 'Wir legen großen Wert auf die praktische Anwendung von Sprachkenntnissen in realen Situationen. Theorie und Praxis werden in unserem Unterricht eng miteinander verknüpft, um echte Kommunikationsfähigkeit zu entwickeln.\n\nUnsere praxisorientierten Ansätze umfassen:\n\n• Simulationen realer Alltagssituationen im Unterricht\n• Regelmäßige Konversationsübungen mit Muttersprachlern\n• Projekte, die praktische Sprachanwendung erfordern\n• Exkursionen und kulturelle Veranstaltungen für authentische Spracherfahrungen\n• Praktische Anwendungsbeispiele aus Beruf und Alltag',
        descriptionFa: 'ما ارزش زیادی برای کاربرد عملی مهارت‌های زبانی در موقعیت‌های واقعی قائل هستیم. نظریه و عمل در آموزش ما به طور نزدیک با یکدیگر مرتبط هستند تا توانایی ارتباطی واقعی را پرورش دهند.\n\nرویکردهای عملی ما شامل موارد زیر است:\n\n• شبیه‌سازی موقعیت‌های واقعی روزمره در کلاس\n• تمرین‌های منظم مکالمه با سخنگویان مادری\n• پروژه‌هایی که نیازمند کاربرد عملی زبان هستند\n• گردش‌های علمی و رویدادهای فرهنگی برای تجربیات اصیل زبانی\n• نمونه‌های کاربردی عملی از حرفه و زندگی روزمره',
        orderIndex: 7,
        isActive: true,
        iconName: 'practice',
        adminId: adminId
      },
      {
        title: 'Gemeinschaft & Zusammenarbeit',
        titleFa: 'جامعه و همکاری',
        description: 'Wir schaffen eine unterstützende Lerngemeinschaft, die auf Zusammenarbeit, gegenseitigem Respekt und gemeinsamen Zielen basiert. Wir glauben, dass Lernen in einem positiven sozialen Kontext effektiver und bereichernder ist.\n\nUnsere Gemeinschaftswerte umfassen:\n\n• Förderung eines inklusiven und respektvollen Lernumfelds\n• Gruppenprojekte und kollaborative Lernaktivitäten\n• Peer-Learning und gegenseitige Unterstützung\n• Gemeinschaftsveranstaltungen zum Netzwerken und kulturellen Austausch\n• Aufbau langfristiger Beziehungen zwischen Studierenden, Alumni und Lehrenden',
        descriptionFa: 'ما یک جامعه یادگیری حمایتی ایجاد می‌کنیم که بر پایه همکاری، احترام متقابل و اهداف مشترک است. ما معتقدیم که یادگیری در یک بستر اجتماعی مثبت، مؤثرتر و غنی‌تر است.\n\nارزش‌های اجتماعی ما شامل موارد زیر است:\n\n• ترویج محیط یادگیری فراگیر و محترمانه\n• پروژه‌های گروهی و فعالیت‌های یادگیری مشارکتی\n• یادگیری همتا و پشتیبانی متقابل\n• رویدادهای اجتماعی برای شبکه‌سازی و تبادل فرهنگی\n• ایجاد روابط بلندمدت بین دانشجویان، فارغ‌التحصیلان و معلمان',
        orderIndex: 8,
        isActive: true,
        iconName: 'community',
        adminId: adminId
      }
    ];
    
    for (const charterData of charters) {
      const charter = await prisma.charter.create({
        data: charterData
      });
      
      console.log(`Created charter: ${charter.title} with ID: ${charter.id}`);
    }
    
    console.log(`Created ${charters.length} charters successfully`);
  } catch (error) {
    console.error("Error creating charters:", error);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 