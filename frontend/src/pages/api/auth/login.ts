import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Users dosyasını oku
function getUsers() {
  try {
    if (!fs.existsSync(path.dirname(USERS_FILE))) {
      fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    }
    
    if (!fs.existsSync(USERS_FILE)) {
      // Varsayılan kullanıcılar
      const defaultUsers = [
        { id: "1", username: "admin", password: "1234", email: "admin@esigorta.com", role: "admin", fullName: "Admin Kullanıcı", commission: 0 },
        { id: "2", username: "sube", password: "1234", email: "sube@esigorta.com", role: "branch", fullName: "Şube Kullanıcısı", commission: 15 },
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Users okunamadı:', error);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanici adi ve sifre gerekli' });
  }

  const users = getUsers();
  const user = users.find(
    (u: any) => u.username === username && u.password === password
  );

  if (user) {
    // Sifre bilgisini kaldır
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      user: userWithoutPassword
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Kullanici adi veya sifre hatali'
    });
  }
}

