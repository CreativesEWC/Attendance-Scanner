// Shared Supabase connection — loaded by every page before its own script.
// The publishable (anon) key below is SAFE to be public; your Row Level
// Security policies in Supabase are what actually protect the data.
const SUPABASE_URL = "https://zbotstiqrohuzfzjiarr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_k63yQ3bR6W5fLA35a-x_6A_5YYQ8mIF";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Looks up the logged-in user's row in `employees` (their role, name, brand, etc).
// Returns null if not logged in or no matching employees row exists yet.
async function getMyEmployeeRecord() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabaseClient
    .from('employees')
    .select('*, brands(name)')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (error) { console.error('employees lookup failed:', error); return null; }
  return data;
}

// Sends the person to the right screen based on their role.
// Call this after login, and also at the top of every protected page
// (so someone can't just type a dashboard URL without being logged in
// and matched to an employee row).
function routeToRoleHome(emp) {
  if (!emp) { window.location.href = 'login.html'; return; }
  switch (emp.role) {
    case 'kiosk':     window.location.href = 'kiosk-live.html'; break;
    case 'admin':
    case 'president':  window.location.href = 'dashboard-admin.html'; break;
    case 'employee':
    default:            window.location.href = 'dashboard-employee.html'; break;
  }
}
