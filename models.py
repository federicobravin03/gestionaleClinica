from database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Numeric
from decimal import Decimal
import datetime
import enum

class Sesso(enum.Enum):
    MASCHIO = "M"
    FEMMINA = "F"

class Ruolo(enum.Enum):
    ADMIN = "Admin"
    SEGRETERIA = "Segreteria"
    MEDICO = "Medico"

class StatoAppuntamento(enum.Enum):
    PROGRAMMATO = "Programmato"
    INCORSO = "In corso"
    CONCLUSO = "Concluso"
    ANNULLATO = "Annullato"

class Paziente(Base):
    __tablename__ = "pazienti"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(30))
    cognome: Mapped[str] = mapped_column(String(30))
    codiceFiscale: Mapped[str] = mapped_column(String(16), unique=True)
    dataNascita: Mapped[datetime.date] = mapped_column()
    telefono: Mapped[str] = mapped_column()
    email: Mapped[str | None] = mapped_column()
    indirizzo: Mapped[str] = mapped_column()
    sesso: Mapped[Sesso] = mapped_column()
    appuntamenti: Mapped[list["Appuntamento"]] = relationship(back_populates="paziente")

class Utente(Base):
    __tablename__ = "utenti"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(30))
    cognome: Mapped[str] = mapped_column(String(30))
    codiceFiscale: Mapped[str] = mapped_column(String(16), unique=True)
    ruolo: Mapped[Ruolo] = mapped_column()
    telefono: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    username: Mapped[str] = mapped_column(unique=True)
    passwordHash: Mapped[str] = mapped_column()
    medico: Mapped[Medico | None] = relationship(back_populates="utente")

class Medico(Base):
    __tablename__ = "medici"

    id: Mapped[int] = mapped_column(primary_key=True)
    numeroAlbo: Mapped[str] = mapped_column(String(5), unique=True)
    specializzazione: Mapped[str] = mapped_column(String(50))
    utente_id: Mapped[int] = mapped_column(ForeignKey("utenti.id"), unique=True)
    utente: Mapped["Utente"] = relationship(back_populates="medico")
    appuntamenti: Mapped[list["Appuntamento"]] = relationship(back_populates="medico")

class Appuntamento(Base):
    __tablename__ = "appuntamenti"

    id: Mapped[int] = mapped_column(primary_key=True)
    dataOra: Mapped[datetime.datetime] = mapped_column()
    prezzo: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    stato: Mapped[StatoAppuntamento] = mapped_column(default=StatoAppuntamento.PROGRAMMATO)
    esito: Mapped[str | None] = mapped_column(String(500))
    paziente_id: Mapped[int] = mapped_column(ForeignKey("pazienti.id"))
    medico_id: Mapped[int] = mapped_column(ForeignKey("medici.id"))
    paziente: Mapped["Paziente"] = relationship(back_populates="appuntamenti")
    medico: Mapped["Medico"] = relationship(back_populates="appuntamenti")