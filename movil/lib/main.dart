import 'package:flutter/material.dart';
import 'screens/rancho_profile_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gandia 7',
      theme: ThemeData(
        scaffoldBackgroundColor: Colors.grey[50],
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const Gandia7App(),
    );
  }
}

class Gandia7App extends StatefulWidget {
  const Gandia7App({super.key});

  @override
  State<Gandia7App> createState() => _Gandia7AppState();
}

class _Gandia7AppState extends State<Gandia7App> {
  int _selectedIndex = 0;

  static final List<String> _menuItems = [
    'Chat',
    'Pasaportes',
    'Gemelos',
    'Monitoreo',
    'Certificación',
    'Verificación',
    'Historial',
  ];

  static final List<IconData> _icons = [
    Icons.chat_bubble_outline,
    Icons.description_outlined,
    Icons.folder_open_outlined,
    Icons.visibility_outlined,
    Icons.check_circle_outline,
    Icons.checklist_outlined,
    Icons.history_outlined,
  ];

  // 👇 Global key para acceder al Scaffold
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey, // 👈 Asignamos la clave al Scaffold
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer(); // ✅ Ahora sí funciona
          },
        ),
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: Colors.grey[800],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  'R',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'Rancho El Búfalo Dorado',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 16,
                color: Colors.black,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      drawer: Drawer(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: Colors.grey[800],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        'R',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Gandia 7',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: ListView.builder(
                itemCount: _menuItems.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    leading: Icon(_icons[index], size: 20),
                    title: Text(_menuItems[index]),
                    selected: _selectedIndex == index,
                    selectedColor: Colors.black,
                    selectedTileColor: Colors.grey[200],
                    onTap: () {
                      // Cierra el drawer
                      Navigator.pop(context);

                      if (index == 0) {
                        // Navega a la pantalla de perfil
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const RanchoProfileScreen()),
                        );
                      } else {
                        // Solo actualiza el estado para otros ítems
                        setState(() {
                          _selectedIndex = index;
                        });
                      }
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Bienvenido a Gandia 7',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Tu asistente inteligente para la gestión ganadera. Pregúntame sobre pasaportes, certificaciones, monitoreo de ganado y más.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: Colors.grey[300]!),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Escribe tu mensaje...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(Icons.mic_outlined),
              onPressed: () {},
            ),
            const SizedBox(width: 8),
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.grey[800],
                borderRadius: BorderRadius.circular(24),
              ),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white),
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}

