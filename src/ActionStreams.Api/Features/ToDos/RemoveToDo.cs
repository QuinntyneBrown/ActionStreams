using ActionStreams.Api.Core;
using ActionStreams.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ActionStreams.Api.Features
{
    public class RemoveToDo
    {
        public class Request: IRequest<Response>
        {
            public Guid ToDoId { get; set; }
        }

        public class Response: ResponseBase
        {
            public ToDoDto ToDo { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly IActionStreamsDbContext _context;
        
            public Handler(IActionStreamsDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var toDo = await _context.ToDos.SingleAsync(x => x.ToDoId == request.ToDoId);

                toDo.Apply(new DomainEvents.DeleteToDo());

                _context.ToDos.Remove(toDo);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    ToDo = toDo.ToDto()
                };
            }
            
        }
    }
}
