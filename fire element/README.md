# FireLoader

A customizable campfire animated loading component for React applications.

## Features

- Pure CSS animations - no external dependencies
- Customizable colors for flame, glow, and embers
- Progressive growth stages for the flame
- Adjustable overall size
- Lightweight and easy to use

## Installation

```bash
npm install react-fire-loader
# or
yarn add react-fire-loader
```

## Usage

```jsx
import { FireLoader } from "react-fire-loader";

function App() {
  return (
    <div>
      <h1>Loading</h1>
      <FireLoader />
    </div>
  );
}
```

## Props

| Prop         | Type                  | Default   | Description                      |
| ------------ | --------------------- | --------- | -------------------------------- |
| `size`       | number                | 120       | Overall size in pixels           |
| `stage`      | 0 \| 1 \| 2 \| 3 \| 4 | 4         | Growth stage of the fire         |
| `flameColor` | string                | "#ef5a00" | Primary color of the flame       |
| `glowColor`  | string                | "#d43322" | Glow/shadow color for the flame  |
| `emberColor` | string                | "#ff4500" | Color of the ember particles     |
| `className`  | string                | ""        | Additional CSS class for styling |

## Examples

### Basic Usage

```jsx
<FireLoader />
```

### Custom Size

```jsx
<FireLoader size={160} />
```

### Custom Colors

```jsx
// Blue flame
<FireLoader
  flameColor="#4286f4"
  glowColor="#2a5298"
  emberColor="#42a5f5"
/>

// Green flame
<FireLoader
  flameColor="#4caf50"
  glowColor="#2e7d32"
  emberColor="#8bc34a"
/>

// Purple flame
<FireLoader
  flameColor="#9c27b0"
  glowColor="#6a1b9a"
  emberColor="#e040fb"
/>
```

### Growth Stages

```jsx
// Pre-ignition (no flames, just embers and wood)
<FireLoader stage={0} />

// Minimal flame (center only)
<FireLoader stage={1} />

// Center + bottom flames
<FireLoader stage={2} />

// Center + bottom + right flames
<FireLoader stage={3} />

// Complete fire (all flames)
<FireLoader stage={4} />
```

### Combining Props

```jsx
<FireLoader
  size={200}
  stage={3}
  flameColor="#ff5722"
  glowColor="#bf360c"
  emberColor="#ff9800"
  className="my-custom-loader"
/>
```

## Progressive Loader Example

```jsx
function LoadingProgress({ progress }) {
  // Calculate stage based on progress percentage
  const getStage = () => {
    if (progress < 25) return 1;
    if (progress < 50) return 2;
    if (progress < 75) return 3;
    return 4;
  };

  return (
    <div>
      <FireLoader stage={getStage()} />
      <div>Loading: {progress}%</div>
    </div>
  );
}
```

## License

MIT
