import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

// Mobile Detection Hook
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Mobile Navigation Drawer
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title = "Navigation"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          {children}
        </div>
      </div>
    </div>
  );
};

// Mobile-Responsive Section Navigation
interface MobileSectionNavProps {
  sections: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    isCompleted?: boolean;
  }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const MobileSectionNav: React.FC<MobileSectionNavProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const activeItem = sections.find(s => s.id === activeSection);

  if (!isMobile) {
    // Desktop version - return null, use regular sidebar
    return null;
  }

  return (
    <>
      {/* Mobile Section Selector */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {activeItem?.icon}
            <span className="font-medium text-gray-900">{activeItem?.title}</span>
          </div>
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Business Plan Sections"
      >
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                setIsDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`flex-shrink-0 ${
                activeSection === section.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {section.title}
                </div>
              </div>
              {section.isCompleted && (
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </MobileDrawer>
    </>
  );
};

// Mobile-Responsive Toolbar
interface MobileToolbarProps {
  title: string;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({
  title,
  actions,
  onBack
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile-Responsive Card Container
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  title?: string;
  defaultCollapsed?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  collapsible = false,
  title,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {collapsible && title ? (
        <>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{title}</span>
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {!isCollapsed && (
            <div className="p-4 pt-0">
              {children}
            </div>
          )}
        </>
      ) : (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Mobile-Responsive Grid
interface MobileGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  className = ''
}) => {
  const gridClasses = `grid gap-4 ${
    cols.mobile === 1 ? 'grid-cols-1' :
    cols.mobile === 2 ? 'grid-cols-2' : 'grid-cols-3'
  } ${
    cols.tablet === 1 ? 'md:grid-cols-1' :
    cols.tablet === 2 ? 'md:grid-cols-2' :
    cols.tablet === 3 ? 'md:grid-cols-3' :
    cols.tablet === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'
  } ${
    cols.desktop === 1 ? 'lg:grid-cols-1' :
    cols.desktop === 2 ? 'lg:grid-cols-2' :
    cols.desktop === 3 ? 'lg:grid-cols-3' :
    cols.desktop === 4 ? 'lg:grid-cols-4' :
    cols.desktop === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-6'
  } ${className}`;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Mobile-Responsive Button Group
interface MobileButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const MobileButtonGroup: React.FC<MobileButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  const containerClasses = `flex gap-2 ${
    isMobile && orientation === 'horizontal' 
      ? 'flex-col' 
      : orientation === 'horizontal' 
        ? 'flex-row' 
        : 'flex-col'
  } ${className}`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Responsive Text Sizes
export const responsiveTextClasses = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  base: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
  '2xl': 'text-2xl md:text-3xl',
  '3xl': 'text-3xl md:text-4xl',
  '4xl': 'text-4xl md:text-5xl'
};

// Responsive Spacing Classes
export const responsiveSpacingClasses = {
  p: {
    sm: 'p-2 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-12'
  },
  m: {
    sm: 'm-2 md:m-4',
    md: 'm-4 md:m-6',
    lg: 'm-6 md:m-8',
    xl: 'm-8 md:m-12'
  }
};

export default {
  useIsMobile,
  MobileDrawer,
  MobileSectionNav,
  MobileToolbar,
  MobileCard,
  MobileGrid,
  MobileButtonGroup,
  responsiveTextClasses,
  responsiveSpacingClasses
}; 