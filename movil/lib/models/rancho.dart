class Rancho {
  final String nombre;
  final String descripcion;
  final String uppid;
  final String rfc;
  final double cumplimiento;
  final int totalAnimales;
  final int corrales;

  Rancho({
    required this.nombre,
    required this.descripcion,
    required this.uppid,
    required this.rfc,
    required this.cumplimiento,
    required this.totalAnimales,
    required this.corrales,
  });

  static Rancho ejemplo() => Rancho(
        nombre: 'Rancho El Búfalo Dorado',
        descripcion: 'Rancho ganadero especializado en la cría y engorda de ganado bovino de alta calidad.',
        uppid: 'UPP-12345-MX',
        rfc: 'GAND750101-H52',
        cumplimiento: 92.0,
        totalAnimales: 452,
        corrales: 14,
      );
}