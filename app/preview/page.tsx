'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Badge,
  Avatar,
  Modal,
  Dropdown,
  Tabs
} from '@/components/ui';
import { Container, Grid, Flex } from '@/components/layout';
import { 
  Heart, 
  Star, 
  Mail, 
  User, 
  Settings, 
  LogOut, 
  Download,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function PreviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value && !value.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Component Library Preview
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Explore all available UI components
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Buttons
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Button Variants</h3>
            </CardHeader>
            <CardContent>
              <Flex gap="md" wrap="wrap">
                <Button variant="default">Default</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </Flex>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Button Sizes</h3>
            </CardHeader>
            <CardContent>
              <Flex gap="md" align="center">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </Flex>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Button States</h3>
            </CardHeader>
            <CardContent>
              <Flex gap="md" wrap="wrap">
                <Button variant="primary" icon={<Heart size={16} />}>
                  With Icon
                </Button>
                <Button variant="primary" icon={<Download size={16} />} iconPosition="right">
                  Icon Right
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" fullWidth>
                  Full Width
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Inputs
          </h2>
          
          <Grid cols={2}>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Input Variants</h3>
              </CardHeader>
              <CardContent>
                <Flex direction="col" gap="lg">
                  <Input label="Username" placeholder="Enter username" />
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={inputValue}
                    onChange={handleEmailChange}
                    error={emailError}
                  />
                  <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••" 
                    helperText="Must be at least 8 characters"
                  />
                  <Input 
                    label="Search" 
                    placeholder="Search..." 
                    icon={<Mail size={18} />}
                  />
                </Flex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Input Sizes</h3>
              </CardHeader>
              <CardContent>
                <Flex direction="col" gap="lg">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input" />
                  <Input size="lg" placeholder="Large input" />
                  <Input disabled placeholder="Disabled input" />
                </Flex>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Cards
          </h2>
          
          <Grid cols={3}>
            <Card variant="default">
              <CardHeader>
                <h3 className="text-lg font-semibold">Default Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This is a default card with a simple border.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <h3 className="text-lg font-semibold">Outlined Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This is an outlined card with a thicker border.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Elevated Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This is an elevated card with a shadow.
                </p>
              </CardContent>
            </Card>

            <Card hoverable>
              <CardHeader>
                <h3 className="text-lg font-semibold">Hoverable Card</h3>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Hover over this card to see the lift effect!
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </Grid>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Badges
          </h2>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Badge Variants</h3>
            </CardHeader>
            <CardContent>
              <Flex gap="md" wrap="wrap">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success" icon={<CheckCircle size={14} />}>Success</Badge>
                <Badge variant="warning" icon={<AlertCircle size={14} />}>Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </Flex>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Badge Sizes</h4>
                <Flex gap="md" align="center">
                  <Badge variant="primary" size="sm">Small</Badge>
                  <Badge variant="primary" size="md">Medium</Badge>
                  <Badge variant="primary" size="lg">Large</Badge>
                </Flex>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Badge Shapes</h4>
                <Flex gap="md">
                  <Badge variant="primary" shape="pill">Pill</Badge>
                  <Badge variant="primary" shape="square">Square</Badge>
                </Flex>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Avatars Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Avatars
          </h2>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Avatar Sizes & Status</h3>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Sizes</h4>
                <Flex gap="md" align="center">
                  <Avatar size="xs" fallback="XS" />
                  <Avatar size="sm" fallback="SM" />
                  <Avatar size="md" fallback="MD" />
                  <Avatar size="lg" fallback="LG" />
                  <Avatar size="xl" fallback="XL" />
                </Flex>
              </div>

              <div>
                <h4 className="font-semibold mb-3">With Status Indicators</h4>
                <Flex gap="md" align="center">
                  <Avatar fallback="ON" status="online" />
                  <Avatar fallback="OF" status="offline" />
                  <Avatar fallback="BY" status="busy" />
                  <Avatar fallback="AW" status="away" />
                </Flex>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Modal
          </h2>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Modal Dialog</h3>
            </CardHeader>
            <CardContent>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Example Modal"
                size="md"
              >
                <Flex direction="col" gap="lg">
                  <p>
                    This is an example modal dialog with smooth animations and
                    accessibility features.
                  </p>
                  <Input label="Your Name" placeholder="Enter your name" />
                  <Input label="Email" type="email" placeholder="you@example.com" />
                  
                  <Flex gap="md" justify="end">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                      Save
                    </Button>
                  </Flex>
                </Flex>
              </Modal>
            </CardContent>
          </Card>
        </section>

        {/* Dropdown Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Dropdown
          </h2>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Dropdown Menu</h3>
            </CardHeader>
            <CardContent>
              <Dropdown
                trigger={
                  <Button variant="outline" icon={<User size={16} />}>
                    User Menu
                  </Button>
                }
                items={[
                  {
                    label: 'Profile',
                    value: 'profile',
                    icon: <User size={16} />,
                    onClick: () => alert('Profile clicked'),
                  },
                  {
                    label: 'Settings',
                    value: 'settings',
                    icon: <Settings size={16} />,
                    onClick: () => alert('Settings clicked'),
                  },
                  {
                    label: 'Logout',
                    value: 'logout',
                    icon: <LogOut size={16} />,
                    onClick: () => alert('Logout clicked'),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Tabs
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Default Tabs</h3>
            </CardHeader>
            <CardContent>
              <Tabs
                variant="default"
                tabs={[
                  {
                    label: 'Overview',
                    value: 'overview',
                    content: (
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Overview Content</h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          This is the overview tab content.
                        </p>
                      </div>
                    ),
                  },
                  {
                    label: 'Details',
                    value: 'details',
                    content: (
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Details Content</h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          This is the details tab content.
                        </p>
                      </div>
                    ),
                  },
                  {
                    label: 'Settings',
                    value: 'settings',
                    content: (
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Settings Content</h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          This is the settings tab content.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Pills Tabs</h3>
            </CardHeader>
            <CardContent>
              <Tabs
                variant="pills"
                tabs={[
                  {
                    label: 'Tab 1',
                    value: 'tab1',
                    content: <p className="text-neutral-600 dark:text-neutral-400">Pills tab 1 content</p>,
                  },
                  {
                    label: 'Tab 2',
                    value: 'tab2',
                    content: <p className="text-neutral-600 dark:text-neutral-400">Pills tab 2 content</p>,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Underline Tabs</h3>
            </CardHeader>
            <CardContent>
              <Tabs
                variant="underline"
                tabs={[
                  {
                    label: 'First',
                    value: 'first',
                    content: <p className="text-neutral-600 dark:text-neutral-400">Underline tab 1 content</p>,
                  },
                  {
                    label: 'Second',
                    value: 'second',
                    content: <p className="text-neutral-600 dark:text-neutral-400">Underline tab 2 content</p>,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        {/* Layout Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Layout Components
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Grid Layout</h3>
            </CardHeader>
            <CardContent>
              <Grid cols={4} gap="md">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-lg text-center"
                  >
                    Grid {i}
                  </div>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Flex Layout</h3>
            </CardHeader>
            <CardContent>
              <Flex justify="between" align="center" className="mb-4">
                <div className="bg-secondary-100 dark:bg-secondary-900/30 px-4 py-2 rounded-lg">
                  Left
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-900/30 px-4 py-2 rounded-lg">
                  Center
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-900/30 px-4 py-2 rounded-lg">
                  Right
                </div>
              </Flex>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">
            Component Library by Utkarsh26
          </p>
        </div>
      </Container>
    </div>
  );
}
