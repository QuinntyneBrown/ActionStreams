using ActionStreams.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;

namespace ActionStreams.Api.Interfaces
{
    public interface IActionStreamsDbContext
    {
        DbSet<ToDo> ToDos { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        
    }
}
