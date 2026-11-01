import { House, MessageCircleMore, Settings, User } from 'lucide-react';
import { Button, Dropdown, Label, Tabs } from '@heroui/react';
import { TokenContext } from '../Context/tokenContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserContext, type UserContextType } from '../Context/UserContext';

function Navbar() {
  const tokenContext = useContext(TokenContext);
  const { userDetails }: UserContextType = useContext(UserContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.includes('profile')
    ? 'profile'
    : location.pathname.includes('notification')
    ? 'notifications'
    : 'feed';

  function logout() {
    localStorage.removeItem('userToken');
    tokenContext?.setToken(null);
  }

  return (
    <>
      <nav className="bg-gray-300 py-5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="nav-logo flex gap-3">
            <h1 className="text-4xl font-extrabold text-blue-800">Route</h1>
          </div>
          <div className="nav-links">
            <Tabs
              selectedKey={selectedKey}
              onSelectionChange={(key) => {
                if (key === 'feed') navigate('/home');
                else if (key === 'profile') navigate('/profile');
                else if (key === 'notifications') navigate('/notification');
              }}
              className="w-full max-w-md"
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="feed" className="flex items-center gap-2 cursor-pointer">
                    <House />
                    <span>Feed</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="profile" className="flex items-center gap-2 cursor-pointer">
                    <User />
                    <span>Profile</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="notifications" className="flex items-center gap-2 cursor-pointer">
                    <MessageCircleMore />
                    <span>Notification</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
          <div className="nav-actions">
            <Dropdown>
              <Button aria-label="Menu" variant="secondary">
                <div className="w-8 h-8 rounded-full flex gap-3 overflow-hidden">
                  <img src={userDetails?.photo} alt="" className="w-full h-full object-cover" />
                </div>
                {userDetails?.name}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                  if (key === 'profile') navigate('/profile');
                  console.log(`Selected: ${key}`);
                }}>
                  <Dropdown.Item id="profile" textValue="profile">
                    <User />
                    <Label>Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="settings" textValue="settings">
                    <Settings />
                    <Label>Settings</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="logout" variant="danger">
                    <button type="button" onClick={logout} className="w-full text-left">
                      <Label>Logout</Label>
                    </button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
