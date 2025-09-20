# System Monitoring Panel

![System Monitoring Panel Preview](C:\Users\Winnie\Desktop\GLM\imgs\Snipaste_2025-09-20_13-54-35.png)

## 📖 Design Description

### Technology Selection

This project uses React 18 + TypeScript + Vite as the basic technology stack, Zustand for state management, ECharts for data visualization, and SASS for styling, ensuring high performance, type safety, and development efficiency.

### AI Usage Method

The project is developed through the 6A workflow (Align, Architect, Atomize, Approve, Automate, Assess). The development AI is responsible for requirements analysis, architecture design, task decomposition, code implementation, and quality assessment, achieving an efficient automated development process. Claude Code+GLM4.5 and Trae-CN's built-in GLM4.5 model are used for comprehensive development, mainly considering that Claude Code+GLM4.5 has extremely strong context processing capabilities, can handle long texts, and has a clear workflow; using Trae-CN's built-in GLM4.5 model for document writing has strong visual capabilities and good interactivity.

### Key Takeaways

Modular design improves code maintainability, TypeScript type system enhances code robustness, real-time data flow management achieves smooth user experience, responsive design ensures multi-device adaptation, and AI-assisted development significantly improves development efficiency and quality.

## ✨ Main Features

- **🖥️ Real-time System Monitoring**: Monitor system resource usage such as CPU, memory, disk, and network
- **📋 Task Management**: Create, view, update, and delete tasks, track task progress and status
- **🚨 Alert System**: Display system alert information in real-time, support alert acknowledgment and processing
- **📊 Data Visualization**: Intuitively display system metrics, task progress, and alert trends through charts
- **🔍 Search and Filter**: Support real-time search and multi-condition filtering to quickly locate needed information
- **🎨 Theme Switching**: Support dark/light theme switching to adapt to different usage environments

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Programming Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Chart Library**: ECharts 5 + echarts-for-react
- **Routing Management**: React Router v6
- **Styling Solution**: SASS + CSS Modules
- **Utility Libraries**: date-fns, lodash, classnames
- **Development Tools**: ESLint, Prettier

## 📁 Project Structure

```
system-monitoring-panel/
├── public/                 # Static resources
├── src/
│   ├── components/         # Component directory
│   │   ├── charts/         # Chart components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Common UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom Hooks
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── services/           # Data services
│   ├── styles/             # Style files
│   ├── constants/          # Constant definitions
│   ├── App.tsx             # App root component
│   ├── main.tsx            # App entry point
│   └── routes.tsx          # Route configuration
├── .eslintrc.cjs           # ESLint configuration
├── .gitignore              # Git ignore file
├── index.html              # HTML template
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project description
```

## 🚀 Quick Start

### Environment Requirements

- Node.js >= 16.0.0
- npm >= 7.0.0

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Detailed Running Guide

For more detailed installation, configuration, and deployment instructions, please refer to the [Running Guide](./RUNNING_GUIDE_EN.md).

## 🔧 Port Configuration

- **Development Server Port**: 5173
- **Preview Server Port**: 4173

## ⌨️ Shortcuts

- **Ctrl/Cmd + S**: Save current page
- **Ctrl/Cmd + R**: Refresh page
- **Ctrl/Cmd + F**: Open search box
- **Ctrl/Cmd + /**: Toggle theme

## 📋 Feature Modules

### 1. System Monitoring Module

- **CPU Monitoring**: Display CPU usage, core count, and temperature
- **Memory Monitoring**: Display memory usage, total, and available
- **Disk Monitoring**: Display disk usage, read/write speed
- **Network Monitoring**: Display network upload/download speed and latency
- **System Load**: Display system average load

### 2. Task Management Module

- **Task List**: Display all tasks and their status
- **Task Details**: View detailed task information
- **Task Creation**: Create new tasks
- **Task Update**: Update task status and progress
- **Task Deletion**: Delete unnecessary tasks
- **Task Filtering**: Filter tasks by status, tags, and other conditions

### 3. Alert System Module

- **Alert List**: Display all alert information
- **Alert Details**: View detailed alert information
- **Alert Acknowledgment**: Acknowledge processed alerts
- **Alert Filtering**: Filter alerts by severity, source, and other conditions
- **Alert Trends**: Display alert trend charts

### 4. Data Visualization Module

- **System Metrics Charts**: Display historical trends of CPU, memory, disk, network, and other metrics
- **Task Progress Charts**: Display task completion and progress distribution
- **Alert Trend Charts**: Display changes in alert count and severity over time
- **Chart Interaction**: Support zoom, data point detail display, and other interactive features

### 5. Search and Filter Module

- **Real-time Search**: Support real-time search for tasks, alerts, and other content
- **Multi-condition Filtering**: Support combination of multiple filter conditions
- **Search Result Categorization**: Display search results by type
- **Search History**: Save search history records

### 6. Theme System Module

- **Dark Theme**: Default dark theme, suitable for monitoring scenarios
- **Light Theme**: Optional light theme, adaptable to different environments
- **Theme Switching**: Support one-click theme switching
- **Theme Persistence**: Save user theme preferences

## 📊 Data Models

### System Metrics

```typescript
interface SystemMetrics {
  timestamp: Date;
  cpu: { usage: number; cores: number; temperature: number };
  memory: { usage: number; total: number; available: number };
  disk: { usage: number; total: number; available: number; readSpeed: number; writeSpeed: number };
  network: { uploadSpeed: number; downloadSpeed: number; latency: number };
  loadAverage: number;
}
```

### Task

```typescript
interface Task {
  id: string;
  name: string;
  targetCluster: string;
  status: TaskStatus;
  progress: number;
  startTime: Date;
  endTime?: Date;
  tags: string[];
  description?: string;
}
```

### Alert

```typescript
interface Alert {
  id: string;
  timestamp: Date;
  source: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  isAcknowledged: boolean;
}
```

## 🛠️ Development Guide

### Adding New Components

1. Create a new component file in the corresponding directory under `src/components`
2. Use TypeScript to define component Props types
3. Implement component logic and styles
4. Export the component and import it where needed

### Adding New Pages

1. Create a new page file in the `src/pages` directory
2. Add a new route in `src/routes.tsx`
3. Implement page logic and styles
4. Add a link in the navigation menu

### Adding New Charts

1. Create a new chart component in the `src/components/charts` directory
2. Inherit from the `BaseChart` component or use ECharts directly
3. Configure chart options and data
4. Import and use the chart component in the page

### Modifying Themes

1. Modify CSS variables in `src/styles/variables.scss`
2. Modify global styles in `src/styles/global.scss`
3. Use CSS variables instead of fixed values in components
4. Test display effects in both dark and light themes

## 🚀 Deployment Guide

### Static Deployment

1. Execute `npm run build` to build the production version
2. Deploy the files under the `dist` directory to a static server
3. Configure the server to support SPA routing (optional)

### Containerized Deployment

1. Create a Dockerfile
2. Build a Docker image
3. Run the Docker container

### Cloud Service Deployment

1. Choose a cloud service provider (Vercel, Netlify, etc.)
2. Connect the code repository
3. Configure build commands and output directory
4. Deploy and configure custom domain (optional)

## ❓ Frequently Asked Questions

### Q: How to add new system metrics?

A: Extend the SystemMetrics interface in `src/types/index.ts`, add corresponding data generation logic in `src/services/MockDataGenerator.ts`, and then add a new chart type in the chart component.

### Q: How to modify data update frequency?

A: Modify the updateInterval parameter in `src/services/DataStreamService.ts`, default is 2000 milliseconds (2 seconds).

### Q: How to customize chart styles?

A: Modify the echartsOption configuration in the chart component, or create a custom theme and apply it to the charts.

### Q: How to add new alert types?

A: Extend the AlertSeverity type in `src/types/index.ts`, and add corresponding processing logic in the alert component.

## 🤝 Contribution Guide

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 📧 Contact

For questions or suggestions, please contact:

- Email: 1930863755@qq.com
- Project Address: https://github.com/yangwinnietang/system-monitoring-panel