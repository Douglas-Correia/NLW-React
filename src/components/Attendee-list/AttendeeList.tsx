import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react"
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from "../IconButton/IconButton"
import { Table } from "../Table/Table"
import { TableHeader } from "../Table/TableHeader"
import { TableCell } from "../Table/TableCell"
import { TableRow } from "../Table/TableRow"
import { ChangeEvent, useEffect, useState } from "react"

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface Attendee {
  id: string,
  name: string,
  email: string,
  checkedInAt: string | null,
  createdAt: string
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? '';
    }

    return '';
  });
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'));
    }

    return 1;
  });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');

    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 0) {
      url.searchParams.set('query', search);
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAttendees(data.attendees);
        setTotal(data.total);
      })
  }, [page, search]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(e.target.value);
    setCurrentPage(1);
  }

  const setCurrentSearch = (search: string) => {
    const url = new URL(window.location.toString());

    url.searchParams.set('search', search);

    window.history.pushState({}, "", url);

    setSearch(search);
  }

  const setCurrentPage = (page: number) => {
    const url = new URL(window.location.toString());

    url.searchParams.set('page', String(page));

    window.history.pushState({}, "", url);

    setPage(page);
  }

  const goToFirstPage = () => {
    setCurrentPage(1);
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  }

  const goToPreviousPage = () => {
    setCurrentPage(page - 1);
  }

  const goToNextPage = () => {
    setCurrentPage(page + 1);
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participates</h1>

        <div className="px-3 w-72 py-1.5 border border-white/10  rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={handleOnChange}
            value={search}
            type="search"
            placeholder="Buscar participante..."
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400" />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participantes</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attende, index) => {
            return (
              <TableRow className="border-b border-white/10 hover:bg-white/5" key={index}>
                <TableCell>
                  <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400" />
                </TableCell>
                <TableCell>{attende.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attende.name}</span>
                    <span>{attende.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attende.createdAt)}</TableCell>
                <TableCell>{attende.checkedInAt === null
                  ? <span className="text-zinc-400">Não fez check-in</span>
                  : dayjs().to(attende.checkedInAt)}</TableCell>
                <TableCell>

                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <TableCell colSpan={3} className="py-3 px-4 text-zinc-300">
            Mostrando {attendees.length} de {total} itens
          </TableCell>
          <TableCell colSpan={3} className="text-right">
            <div className="inline-flex items-center gap-8">
              <span>página {page} de {totalPages}</span>
              <div className="flex gap-1.5">
                <IconButton onClick={goToFirstPage} disabled={page === 1}>
                  <ChevronsLeft className="size-4" />
                </IconButton>

                <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                  <ChevronLeft className="size-4" />
                </IconButton>

                <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                  <ChevronRight className="size-4" />
                </IconButton>

                <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                  <ChevronsRight className="size-4" />
                </IconButton>
              </div>
            </div>
          </TableCell>
        </tfoot>
      </Table>
    </div>
  )
}
