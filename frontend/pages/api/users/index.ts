import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users: any[]) {
  try {
    if (!fs.existsSync(path.dirname(USERS_FILE))) {
      fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Kullanicilar kaydedilemedi:', error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - Tum kullanicilari listele
  if (req.method === 'GET') {
    const users = getUsers();
    const usersWithoutPasswords = users.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
    return res.status(200).json(usersWithoutPasswords);
  }

  // POST - Yeni kullanici ekle
  if (req.method === 'POST') {
    const { username, password, email, role, fullName, commission } = req.body;

    if (!username || !password || !email || !role || !fullName) {
      return res.status(400).json({ error: 'Tum alanlar gerekli' });
    }

    const users = getUsers();
    
    // Kullanici adi kontrolu
    if (users.some((u: any) => u.username === username)) {
      return res.status(400).json({ error: 'Bu kullanici adi zaten kullaniliyor' });
    }

    const newUser = {
      id: String(Date.now()),
      username,
      password,
      email,
      role,
      fullName,
      commission: commission || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      monthlyPolicies: 0,
      monthlyRevenue: 0
    };

    users.push(newUser);
    
    if (saveUsers(users)) {
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } else {
      return res.status(500).json({ error: 'Kullanici kaydedilemedi' });
    }
  }

  // DELETE - Kullanici sil
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const users = getUsers();
    const filteredUsers = users.filter((u: any) => u.id !== id);
    
    if (saveUsers(filteredUsers)) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Kullanici silinemedi' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

