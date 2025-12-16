export const PROFILE = {
  name: "Amartya Anayachala",
  title: "Tech Enthusiast",
  titles: ["AI/ML SCIENTIST", "DATA SCIENTIST", "SOLUTIONS ARCHITECT", "SOFTWARE DEVELOPER"],
  bio: "Specializing in Generative AI, Computer Vision, and scalable Web Architecture.",
  social: {
    github: "https://github.com/azrael-2704",
    linkedin: "https://www.linkedin.com/in/anayachala/",
    instagram: "https://www.instagram.com/_amartyaa_/",
    email: "mailto:anayachala.dev@gmail.com"
  },
  about: "I am a passionate AI/ML Scientist with a deep focus on Generative Models and Computer Vision. Bridging the gap between theoretical research and production-grade applications, I build systems that can see, understand, and create. When not training models, I'm architecting scalable full-stack applications.",
  stats: [
    { label: "Years Experience", value: "1" },
    { label: "Models Deployed", value: "5+" },
    { label: "Research Papers", value: "1" },
    { label: "Coffee/Day", value: "∞" }
  ]
};

export const SKILLS = [
  // AI/ML - The Core
  { id: "pytorch", name: "PyTorch", category: "ml", level: 95, version: "2.5", desc: "Deep Learning, Custom Architectures" },
  { id: "tensorflow", name: "TensorFlow", category: "ml", level: 85, version: "2.18", desc: "Production Pipelines, TFX" },
  { id: "transformers", name: "Transformers (HF)", category: "ml", level: 92, version: "4.46", desc: "LLMs, BERT, GPT, LoRA" },
  { id: "opencv", name: "OpenCV", category: "ml", level: 88, version: "4.10", desc: "Computer Vision, Real-time Proc" },
  { id: "langchain", name: "LangChain", category: "ml", level: 90, version: "0.3", desc: "RAG Systems, Agents" },

  // Data Science & Viz
  { id: "pandas", name: "Pandas", category: "ds", level: 95, version: "2.2", desc: "Data Manipulation, Analysis" },
  { id: "powerbi", name: "Power BI", category: "ds", level: 85, version: "Pro", desc: "Business Intelligence Dashboards" },
  { id: "tableau", name: "Tableau", category: "ds", level: 80, version: "2024.3", desc: "Visual Analytics" },
  { id: "matplotlib", name: "Matplotlib / Seaborn", category: "ds", level: 90, version: "3.9", desc: "Scientific Visualization" },
  { id: "sklearn", name: "Scikit-Learn", category: "ds", level: 92, version: "1.5", desc: "Classical ML Algorithms" },

  // Development - The Interface
  { id: "react", name: "React + Vite", category: "dev", level: 90, version: "18.3", desc: "Modern UI, Component Systems" },
  { id: "typescript", name: "TypeScript", category: "dev", level: 88, version: "5.7", desc: "Type-Safe Architecture" },
  { id: "nextjs", name: "Next.js", category: "dev", level: 85, version: "15.0", desc: "SSR, Edge Functions" },
  { id: "threejs", name: "Three.js / R3F", category: "dev", level: 75, version: "r170", desc: "3D Visualizations, WebGL" },
  { id: "tailwind", name: "Tailwind CSS", category: "dev", level: 95, version: "3.4", desc: "Rapid Styling, Design Systems" },

  // Operations - The Infrastructure
  { id: "docker", name: "Docker", category: "ops", level: 85, version: "27.3", desc: "Containerization, Microservices" },
  { id: "kubernetes", name: "Kubernetes", category: "ops", level: 75, version: "1.31", desc: "Orchestration, Scaling" },
  { id: "aws", name: "AWS", category: "ops", level: 80, version: "SDK v3", desc: "SageMaker, EC2, Lambda" },
  { id: "fastapi", name: "FastAPI", category: "ops", level: 92, version: "0.115", desc: "High-Perf Async APIs" },

  // Core - The Foundation
  { id: "python", name: "Python", category: "core", level: 98, version: "3.9+", desc: "Algorithms, Scripting, Everything" },
  { id: "cpp", name: "C++", category: "core", level: 70, version: "23", desc: "Low-Level Optimization" },
  { id: "sql", name: "SQL/NoSQL", category: "core", level: 85, version: "2023", desc: "Postgres, MongoDB, Vector DBs" },
];

export const PROJECTS = [
  {
    id: "p1",
    title: "NEURAL STYLE ENGINE",
    desc: "Real-time semantic style transfer engine capable of processing video streams at 60 FPS using simplified VGG-19 architecture and WebGL acceleration.",
    details: [
      "Implemented custom VGG-19 perceptual loss function for high-fidelity style transfer.",
      "Optimized compute shaders for WebGL to achieve 60FPS directly in the browser.",
      "Hybrid architecture offloading heavy tensor operations to a FastAPI backend."
    ],
    tech: ["PyTorch", "React", "WebGL", "FastAPI"],
    domain: "Computer Vision",
    link: "https://style-engine.demo",
    github: "https://github.com/azrael-2704/neural-style",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop", // Abstract Glitch Art
    featured: true,
    type: 'research'
  },
  {
    id: "p2",
    title: "LATENT SPACE EXPLORER",
    desc: "Interactive 3D visualization tool for high-dimensional vector embeddings, allowing users to traverse semantic relationships in LLM latent spaces.",
    details: [
      "Applied UMAP for dimensionality reduction of 1536d embeddings to 3D space.",
      "Built high-performance 3D scatter plot with Raycasting for 50k+ points.",
      "Implemented efficiently cached spatial indexing for sub-100ms queries."
    ],
    tech: ["Three.js", "TensorFlow.js", "D3", "UMAP"],
    domain: "NLP / Visualization",
    link: "https://latent.demo",
    github: "https://github.com/azrael-2704/latent-viz",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop", // Cyberpunk Network
    featured: true,
    type: 'experiment'
  },
  {
    id: "p3",
    title: "QUANTUM FRAUD DETECTOR",
    desc: "GNN-based anomaly detection pipeline processing 1M+ transactions/sec. reduced false positives by 40% using temporal graph networks.",
    details: [
      "Leveraged Temporal Graph Networks (TGN) to capture dynamic transaction flows.",
      "Scalable ingestion pipeline using Kafka and Apache Flink.",
      "Deployed to Kubernetes with auto-scaling inference endpoints."
    ],
    tech: ["Python", "Neo4j", "PyTorch Geometric", "Kafka"],
    domain: "FinTech / Security",
    image: "https://images.unsplash.com/photo-1558494949-efc527651087?q=80&w=1740&auto=format&fit=crop", // Data Network
    featured: false,
    type: 'product'
  },
  {
    id: "p4",
    title: "GENERATIVE VIDEO SYNTHESIS",
    desc: "Novel diffusion-based architecture for coherent video generation from text prompts, optimizing temporal consistency.",
    details: [
      "Introduced temporal attention layers to standard Diffusion Transformers.",
      "Fine-tuned on custom cinematic dataset for consistent color grading.",
      "Optimized inference time by 30% using TensorRT quantization."
    ],
    tech: ["Diffusers", "Python", "CUDA", "FFmpeg"],
    domain: "Generative AI",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop", // Abstract Wave
    featured: false,
    type: 'research'
  }
];

export const TIMELINE = [
  {
    id: "t1",
    title: "ML Engineer Intern",
    org: "Guardian India",
    date: "2023 - Present",
    desc: "Developing automated fraud detection pipelines using GNNs. Deployed 3 models to production reducing latency by 40%.",
    type: "work",
    side: "right"
  },
  {
    id: "t2",
    title: "Best Research Paper",
    org: "International Conference on AI",
    date: "Dec 2023",
    desc: "Awarded for 'Optimizing Latent Space Traversal in GANs'. Recognized for novel approach in generative consistency.",
    type: "achievement",
    side: "left"
  },
  {
    id: "t3",
    title: "TensorFlow Developer Certificate",
    org: "Google",
    date: "Aug 2023",
    desc: "Professional certification validating expertise in building and deploying models using TensorFlow.",
    type: "certification",
    side: "right"
  },
  {
    id: "t4",
    title: "Freelance Fullstack Dev",
    org: "Self-Employed",
    date: "2021 - 2023",
    desc: "Architected scalable web ecosystems for fintech startups. Built real-time trading dashboards using React & WebSocket.",
    type: "work",
    side: "left"
  },
  {
    id: "t5",
    title: "B.Tech in Computer Science",
    org: "University of Technology",
    date: "2019 - 2023",
    desc: "Specialized in Artificial Intelligence. Graduated with Honors. Capstone project: 'Autonomous Drone Navigation via RL'.",
    type: "education",
    side: "right"
  },
  {
    id: "t6",
    title: "AWS Certified Solutions Architect",
    org: "Amazon Web Services",
    date: "Jan 2022",
    desc: "Validated ability to design distributed systems on AWS.",
    type: "certification",
    side: "left"
  },
  {
    id: "t7",
    title: "National Hackathon Winner",
    org: "Smart India Hackathon",
    date: "2021",
    desc: "Secured 1st place among 500+ teams for building an AI-powered disaster response system.",
    type: "achievement",
    side: "left"
  }
];

export const PHILOSOPHY = [
  { id: "ph1", title: "First Principles", desc: "Break complexity down to its fundamental truths. Build up from there." },
  { id: "ph2", title: "Human-AI Symbiosis", desc: "AI should augment human intelligence, not replace it." },
  { id: "ph3", title: "Open Source", desc: "Knowledge grows when shared. Contribute back to the collective intelligence." },
  { id: "ph4", title: "Scalability", desc: "Design systems that can evolve and handle exponential growth." }
];

export const ROADMAP = [
  { id: "r1", title: "Launch Startup", date: "Q1 2025", desc: "Deploy MVP for Generative AI Video tool.", status: "planned" },
  { id: "r2", title: "PhD Research", date: "2026", desc: "Deep dive into Neuro-symbolic AI.", status: "planned" },
  { id: "r3", title: "Open Source Library", date: "Q4 2024", desc: "Release 'TensorFlow-lite-extended' for edge devices.", status: "in-progress" }
];

export const BLOG_POSTS = [
  { 
      id: "b1", 
      title: "The Future of Generative Video", 
      date: "Oct 12, 2023", 
      readTime: "5 min", 
      desc: "Exploring diffusion models and temporal consistency in video synthesis.", 
      tags: ["AI", "Generative", "Video"],
      link: "#" 
  },
  { 
      id: "b2", 
      title: "Optimizing Graph Neural Networks", 
      date: "Sep 28, 2023", 
      readTime: "8 min", 
      desc: "Techniques for scaling GNNs to billion-edge graphs using PyTorch Geometric.", 
      tags: ["GNN", "Optimization", "PyTorch"],
      link: "#" 
  },
  { 
      id: "b3", 
      title: "Building Resilient APIs with FastAPI", 
      date: "Aug 15, 2023", 
      readTime: "6 min", 
      desc: "Best practices for async architecture and error handling in high-load systems.", 
      tags: ["FastAPI", "Backend", "Python"],
      link: "#" 
  }
];
