import React, { useState, useEffect } from "react";

const fetchData = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

interface WithDataWrapperProps<T> {
  url: string;
  children: React.FC<T & { [key: string]: unknown }>;
  [key: string]: unknown; // For additional props to pass to children
}

// couldn't find a way to prevent flashing of the loading text.
// tried to use a state to keep track of the previous rendered component but it didn't prevent flashing.
// so I'm not going to use this component in the project.
// I'm going to use the normal way of fetching data in the components.
const WithDataWrapper = <T,>({
  url,
  children,
  ...props
}: WithDataWrapperProps<T>) => {
  const [lastRendered, setLastRendered] = useState<React.ReactNode | null>(
    null
  );

  // Lazy load the component
  const Component = React.lazy(() =>
    fetchData<T>(url).then(data => ({
      default: () => children({ ...data, ...props })
    }))
  );

  // Save the rendered component after it is mounted
  useEffect(() => {
    if (lastRendered === null) {
      setLastRendered(<Component />);
    }
  }, [Component, lastRendered]);

  return (
    <React.Suspense fallback={lastRendered || <div>Loading...</div>}>
      <Component />
    </React.Suspense>
  );
};

export default WithDataWrapper;
