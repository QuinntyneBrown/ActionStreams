using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using ActionStreams.Api.Extensions;
using ActionStreams.Api.Core;
using ActionStreams.Api.Interfaces;
using ActionStreams.Api.Extensions;
using Microsoft.EntityFrameworkCore;

namespace ActionStreams.Api.Features
{
    public class GetToDosPage
    {
        public class Request: IRequest<Response>
        {
            public int PageSize { get; set; }
            public int Index { get; set; }
        }

        public class Response: ResponseBase
        {
            public int Length { get; set; }
            public List<ToDoDto> Entities { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly IActionStreamsDbContext _context;
        
            public Handler(IActionStreamsDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var query = from toDo in _context.ToDos
                    select toDo;
                
                var length = await _context.ToDos.CountAsync();
                
                var toDos = await query.Page(request.Index, request.PageSize)
                    .Select(x => x.ToDto()).ToListAsync();
                
                return new()
                {
                    Length = length,
                    Entities = toDos
                };
            }
            
        }
    }
}
